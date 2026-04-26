import { DEFAULT_HOME_LEAGUES, LEAGUES } from '@/src/constants/leagues';
import { apiGet } from '@/src/lib/api/client';
import { apiConfig } from '@/src/lib/api/config';
import { mockFootballApi } from './mockFootballApi';
import type {
  FootballApi,
  FootballDataProvider,
  LeagueFetchDiagnostic,
  Match,
  MatchDetails,
  MatchEvent,
  MatchStat,
  Standing,
} from './footballTypes';
import { normalizeFootballDataProvider } from './footballProvider';

type ApiResponse<T> = {
  results: number;
  response: T;
  errors?: unknown;
};

type TodayMatchesMode = 'today' | 'upcoming';

const DEFAULT_DATE = () => formatDateInTimezone(apiConfig.defaultTimezone);
let lastTodayMatchesDiagnostics: LeagueFetchDiagnostic[] = [];
let lastTodayMatchesMode: TodayMatchesMode = 'today';

export const liveFootballApi: FootballApi = {
  async getTodayMatches(date = DEFAULT_DATE()) {
    const todayResults = await fetchFixturesByLeague({
      date,
      season: apiConfig.defaultSeason,
      timezone: apiConfig.defaultTimezone,
    });

    lastTodayMatchesDiagnostics = todayResults.diagnostics;
    lastTodayMatchesMode = 'today';

    if (!todayResults.matches.length && todayResults.failedResults.length) {
      throw todayResults.failedResults[0].reason;
    }

    if (todayResults.failedResults.length) {
      console.warn(
        `Live fixtures loaded with partial results. ${todayResults.failedResults.length} league request(s) failed.`,
      );
    }

    if (todayResults.matches.length) {
      return todayResults.matches;
    }

    const upcomingResults = await fetchFixturesByLeague({
      next: 3,
      season: apiConfig.defaultSeason,
      timezone: apiConfig.defaultTimezone,
    });

    lastTodayMatchesDiagnostics = upcomingResults.diagnostics;
    lastTodayMatchesMode = 'upcoming';

    if (!upcomingResults.matches.length && upcomingResults.failedResults.length) {
      throw upcomingResults.failedResults[0].reason;
    }

    if (upcomingResults.failedResults.length) {
      console.warn(
        `Upcoming live fixtures loaded with partial results. ${upcomingResults.failedResults.length} league request(s) failed.`,
      );
    }

    if (upcomingResults.matches.length) {
      return upcomingResults.matches;
    }

    const broadUpcomingResults = await fetchBroadUpcomingFixtures({
      next: 20,
      timezone: apiConfig.defaultTimezone,
    });

    lastTodayMatchesDiagnostics = broadUpcomingResults.diagnostics;
    lastTodayMatchesMode = 'upcoming';

    if (!broadUpcomingResults.matches.length && broadUpcomingResults.failedResults.length) {
      throw broadUpcomingResults.failedResults[0].reason;
    }

    if (broadUpcomingResults.failedResults.length) {
      console.warn(
        `Broad upcoming live fixtures loaded with partial results. ${broadUpcomingResults.failedResults.length} request(s) failed.`,
      );
    }

    return broadUpcomingResults.matches;
  },
  async getMatchDetails(matchId: number) {
    const [fixtureResult, statsResult, eventsResult] = await Promise.all([
      apiGet<ApiResponse<any[]>>('/fixtures', { id: matchId, timezone: apiConfig.defaultTimezone }),
      apiGet<ApiResponse<any[]>>('/fixtures/statistics', { fixture: matchId }),
      apiGet<ApiResponse<any[]>>('/fixtures/events', { fixture: matchId }),
    ]);

    const fixture = fixtureResult.response?.[0];
    if (!fixture) {
      throw new Error('Match not found');
    }

    return {
      id: fixture.fixture.id,
      league: fixture.league.name,
      home: fixture.teams.home.name,
      away: fixture.teams.away.name,
      score:
        fixture.goals?.home === null || fixture.goals?.away === null
          ? 'vs'
          : `${fixture.goals.home} - ${fixture.goals.away}`,
      status: formatStatus(fixture.fixture.status?.short),
      venue: fixture.fixture.venue?.name,
      events: flattenEvents(eventsResult.response),
      stats: flattenStats(statsResult.response),
    };
  },
  async getStandings(leagueId: number) {
    const result = await apiGet<ApiResponse<any[]>>('/standings', {
      league: leagueId,
      season: apiConfig.defaultSeason,
    });

    const rows = result.response?.[0]?.league?.standings?.[0] ?? [];
    return rows.map((row: any) => ({
      rank: row.rank,
      team: row.team.name,
      played: row.all.played,
      won: row.all.win,
      drawn: row.all.draw,
      lost: row.all.lose,
      points: row.points,
    }));
  },
};

async function fetchFixturesByLeague(params: {
  date?: string;
  next?: number;
  season: number;
  timezone: string;
}) {
  const requests = DEFAULT_HOME_LEAGUES.map(async (league) => {
    const result = await apiGet<ApiResponse<any[]>>('/fixtures', {
      league,
      season: params.season,
      timezone: params.timezone,
      date: params.date,
      next: params.next,
    });

    return {
      league,
      result,
    };
  });

  const settledResults = await Promise.allSettled(requests);
  const successfulResults = settledResults.filter(isFulfilled).map((result) => result.value);
  const failedResults = settledResults.filter(isRejected);

  const diagnostics = settledResults
    .map((result, index) => {
      const leagueId = DEFAULT_HOME_LEAGUES[index] ?? -1;

      if (result.status === 'fulfilled') {
        return {
          leagueId,
          status: 'success' as const,
          matchCount: result.value.result.response?.length ?? 0,
        };
      }

      return {
        leagueId,
        status: 'error' as const,
        matchCount: 0,
        message: getDiagnosticMessage(result.reason),
      };
    })
    .sort((a, b) => a.leagueId - b.leagueId);

  return {
    diagnostics,
    failedResults,
    matches: successfulResults.flatMap(({ result }) => (result.response ?? []).map(mapFixture)),
  };
}

async function fetchBroadUpcomingFixtures(params: {
  next: number;
  timezone: string;
}) {
  const requests = [undefined, LEAGUES.PREMIER_LEAGUE, LEAGUES.PSL].map(async (league) => {
    const result = await apiGet<ApiResponse<any[]>>('/fixtures', {
      next: params.next,
      timezone: params.timezone,
      league,
    });

    return {
      league: league ?? 0,
      result,
    };
  });

  const settledResults = await Promise.allSettled(requests);
  const successfulResults = settledResults.filter(isFulfilled).map((result) => result.value);
  const failedResults = settledResults.filter(isRejected);

  const byId = new Map<number, Match>();
  successfulResults
    .flatMap(({ result }) => (result.response ?? []).map(mapFixture))
    .forEach((match) => {
      if (!byId.has(match.id)) {
        byId.set(match.id, match);
      }
    });

  const diagnostics = settledResults.map((result, index) => {
    const requestedLeague = [0, LEAGUES.PREMIER_LEAGUE, LEAGUES.PSL][index] ?? 0;

    if (result.status === 'fulfilled') {
      return {
        leagueId: requestedLeague,
        status: 'success' as const,
        matchCount: result.value.result.response?.length ?? 0,
        message: requestedLeague === 0 ? 'Global upcoming fixtures query' : undefined,
      };
    }

    return {
      leagueId: requestedLeague,
      status: 'error' as const,
      matchCount: 0,
      message: getDiagnosticMessage(result.reason),
    };
  });

  return {
    diagnostics,
    failedResults,
    matches: Array.from(byId.values()).slice(0, 12),
  };
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

function isRejected(
  result: PromiseSettledResult<unknown>,
): result is PromiseRejectedResult {
  return result.status === 'rejected';
}

function getDiagnosticMessage(reason: unknown) {
  if (reason instanceof Error) {
    return reason.message;
  }

  return 'Unknown request failure.';
}

export function getFootballDataProvider(): FootballDataProvider {
  return normalizeFootballDataProvider(process.env.EXPO_PUBLIC_FOOTBALL_DATA_PROVIDER) as FootballDataProvider;
}

export function getLastTodayMatchesDiagnostics(): LeagueFetchDiagnostic[] {
  return lastTodayMatchesDiagnostics.map((item) => ({ ...item }));
}

export function getLastTodayMatchesMode(): TodayMatchesMode {
  return lastTodayMatchesMode;
}

export function getFootballApi(): FootballApi {
  return getFootballDataProvider() === 'live' ? liveFootballApi : mockFootballApi;
}

export async function getTodayMatches(date?: string): Promise<Match[]> {
  return getFootballApi().getTodayMatches(date);
}

export async function getMatchDetails(matchId: number): Promise<MatchDetails> {
  return getFootballApi().getMatchDetails(matchId);
}

export async function getStandings(leagueId: number): Promise<Standing[]> {
  return getFootballApi().getStandings(leagueId);
}

export async function getStandingsWithSeasonFallback(leagueId: number): Promise<{
  standings: Standing[];
  seasonUsed: number;
}> {
  const seasonsToTry = [apiConfig.defaultSeason, apiConfig.defaultSeason - 1].filter(
    (season, index, values) => season > 0 && values.indexOf(season) === index,
  );

  let lastError: unknown = null;

  for (const season of seasonsToTry) {
    try {
      const result = await apiGet<ApiResponse<any[]>>('/standings', {
        league: leagueId,
        season,
      });

      const rows = result.response?.[0]?.league?.standings?.[0] ?? [];
      if (rows.length) {
        return {
          standings: rows.map((row: any) => ({
            rank: row.rank,
            team: row.team.name,
            played: row.all.played,
            won: row.all.win,
            drawn: row.all.draw,
            lost: row.all.lose,
            points: row.points,
          })),
          seasonUsed: season,
        };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return {
    standings: [],
    seasonUsed: apiConfig.defaultSeason,
  };
}

function mapFixture(item: any): Match {
  const goalsHome = item?.goals?.home;
  const goalsAway = item?.goals?.away;
  const score =
    goalsHome === null || goalsHome === undefined || goalsAway === null || goalsAway === undefined
      ? 'vs'
      : `${goalsHome} - ${goalsAway}`;

  return {
    id: item.fixture.id,
    league: item.league.name,
    leagueId: item.league.id,
    home: item.teams.home.name,
    away: item.teams.away.name,
    time: formatTime(item.fixture.timestamp),
    timestamp: item.fixture.timestamp,
    status: formatStatus(item.fixture.status?.short),
    score,
  };
}

function formatStatus(raw?: string): string {
  if (!raw) return 'UPCOMING';
  if (['1H', '2H', 'HT', 'LIVE', 'ET', 'BT', 'P'].includes(raw)) return 'LIVE';
  if (['FT', 'AET', 'PEN'].includes(raw)) return 'FT';
  return 'UPCOMING';
}

function flattenStats(statsBlock: any[] | undefined): MatchStat[] {
  if (!statsBlock || !statsBlock.length) return [];
  const homeStats = statsBlock[0]?.statistics ?? [];
  return homeStats.slice(0, 6).map((stat: any) => ({
    label: String(stat.type ?? 'Stat'),
    value: String(stat.value ?? '-'),
  }));
}

function flattenEvents(events: any[] | undefined): MatchEvent[] {
  if (!events || !events.length) return [];
  return events.slice(0, 12).map((event: any) => ({
    time: `${event.time?.elapsed ?? ''}'`,
    detail: `${event.type ?? ''} ${event.detail ?? ''}`.trim(),
  }));
}

function formatTime(timestampSeconds?: number): string {
  if (!timestampSeconds) return '--:--';
  const date = new Date(timestampSeconds * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDateInTimezone(timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';

  return `${year}-${month}-${day}`;
}
