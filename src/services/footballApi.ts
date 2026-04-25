import { DEFAULT_HOME_LEAGUES } from '@/src/constants/leagues';
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

const DEFAULT_DATE = () => new Date().toISOString().slice(0, 10);
let lastTodayMatchesDiagnostics: LeagueFetchDiagnostic[] = [];

export const liveFootballApi: FootballApi = {
  async getTodayMatches(date = DEFAULT_DATE()) {
    const requests = DEFAULT_HOME_LEAGUES.map(async (league) => {
      const result = await apiGet<ApiResponse<any[]>>('/fixtures', {
        date,
        league,
        season: apiConfig.defaultSeason,
        timezone: apiConfig.defaultTimezone,
      });

      return {
        league,
        result,
      };
    });

    const settledResults = await Promise.allSettled(requests);
    const successfulResults = settledResults.filter(isFulfilled).map((result) => result.value);
    const failedResults = settledResults.filter(isRejected);

    lastTodayMatchesDiagnostics = settledResults
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

    if (!successfulResults.length && failedResults.length) {
      throw failedResults[0].reason;
    }

    if (failedResults.length) {
      console.warn(
        `Live fixtures loaded with partial results. ${failedResults.length} league request(s) failed.`,
      );
    }

    return successfulResults.flatMap(({ result }) => (result.response ?? []).map(mapFixture));
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
