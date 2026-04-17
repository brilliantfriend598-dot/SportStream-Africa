import { DEFAULT_HOME_LEAGUES } from '@/src/constants/leagues';
import { apiGet } from '@/src/lib/api/client';
import { apiConfig } from '@/src/lib/api/config';
import type { ApiResponse } from '@/src/lib/api/types';
import { mockFootballApi } from './mockFootballApi';
import type { FootballApi, FootballDataProvider, Match } from './footballTypes';

const DEFAULT_DATE = () => new Date().toISOString().slice(0, 10);

export const liveFootballApi: FootballApi = {
  async getTodayMatches(date = DEFAULT_DATE()) {
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
  },
};

export function getFootballDataProvider(): FootballDataProvider {
  const value = process.env.EXPO_PUBLIC_FOOTBALL_DATA_PROVIDER?.toLowerCase();
  return value === 'live' ? 'live' : 'mock';
}

export function getFootballApi(): FootballApi {
  return getFootballDataProvider() === 'live' ? liveFootballApi : mockFootballApi;
}

export async function getTodayMatches(date?: string): Promise<Match[]> {
  return getFootballApi().getTodayMatches(date);
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

function formatTime(timestampSeconds?: number): string {
  if (!timestampSeconds) return '--:--';
  const date = new Date(timestampSeconds * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
