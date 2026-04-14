import { apiGet } from './client';
import { apiConfig } from './config';
import { DEFAULT_HOME_LEAGUES } from '@/src/constants/leagues';
import type { ApiResponse, MatchDetails, MatchEvent, MatchItem, MatchStat, StandingRow } from './types';

function formatStatus(raw?: string): string {
  if (!raw) return 'UPCOMING';
  if (['1H', '2H', 'HT', 'LIVE', 'ET', 'BT', 'P'].includes(raw)) return 'LIVE';
  if (['FT', 'AET', 'PEN'].includes(raw)) return 'FT';
  return 'UPCOMING';
}

function formatTime(timestampSeconds?: number): string {
  if (!timestampSeconds) return '--:--';
  const date = new Date(timestampSeconds * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mapFixture(item: any): MatchItem {
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

function flattenStats(statsBlock: any[] | undefined): MatchStat[] {
  if (!statsBlock || !statsBlock.length) return [];
  const homeStats = statsBlock[0]?.statistics ?? [];
  return homeStats
    .slice(0, 6)
    .map((s: any) => ({
      label: String(s.type ?? 'Stat'),
      value: String(s.value ?? '-'),
    }));
}

function flattenEvents(events: any[] | undefined): MatchEvent[] {
  if (!events || !events.length) return [];
  return events.slice(0, 12).map((e: any) => ({
    time: `${e.time?.elapsed ?? ''}'`,
    detail: `${e.type ?? ''} ${e.detail ?? ''}`.trim(),
  }));
}

export async function getTodayMatches(date = new Date().toISOString().slice(0, 10)): Promise<MatchItem[]> {
  const requests = DEFAULT_HOME_LEAGUES.map((league) =>
    apiGet<ApiResponse<any[]>>('/fixtures', {
      date,
      league,
      season: apiConfig.defaultSeason,
      timezone: apiConfig.defaultTimezone,
    }),
  );

  const results = await Promise.all(requests);
  return results.flatMap((result) => (result.response ?? []).map(mapFixture));
}

export async function getMatchDetails(matchId: number): Promise<MatchDetails> {
  const [fixtureResult, statsResult, eventsResult] = await Promise.all([
    apiGet<ApiResponse<any[]>>('/fixtures', { id: matchId, timezone: apiConfig.defaultTimezone }),
    apiGet<ApiResponse<any[]>>('/fixtures/statistics', { fixture: matchId }),
    apiGet<ApiResponse<any[]>>('/fixtures/events', { fixture: matchId }),
  ]);

  const fixture = fixtureResult.response?.[0];
  if (!fixture) throw new Error('Match not found');

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
}

export async function getStandings(leagueId: number): Promise<StandingRow[]> {
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
}
