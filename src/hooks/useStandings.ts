import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '@/src/lib/api/client';
import { apiConfig } from '@/src/lib/api/config';
import {
  getFootballDataProvider,
  getStandings,
  getStandingsWithSeasonFallback,
} from '@/src/services/footballApi';
import { resolveFallbackNotice, resolveListFetchState } from '@/src/services/footballFallback';
import { mockFootballApi } from '@/src/services/mockFootballApi';
import type { Standing } from '@/src/services/footballTypes';

export function useStandings(leagueId?: number) {
  const [data, setData] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(Boolean(leagueId));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'sample'>('sample');
  const [seasonUsed, setSeasonUsed] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    if (!leagueId) return;
    const provider = getFootballDataProvider();
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const { standings, seasonUsed: resolvedSeason } =
        provider === 'live'
          ? await getStandingsWithSeasonFallback(leagueId)
          : { standings: await getStandings(leagueId), seasonUsed: apiConfig.defaultSeason };
      setSeasonUsed(resolvedSeason);
      if (standings.length === 0) {
        const fallback = await mockFootballApi.getStandings(leagueId);
        const nextState = resolveListFetchState(
          provider,
          false,
          getEmptyStandingsMessage(resolvedSeason),
          null,
        );
        setData(fallback);
        setNotice(nextState.notice);
        setSource(nextState.source as 'live' | 'sample');
      } else {
        const nextState = resolveListFetchState(provider, true, null, null);
        setData(standings);
        setNotice(
          provider === 'live' && resolvedSeason !== apiConfig.defaultSeason
            ? getSeasonFallbackMessage(resolvedSeason)
            : null,
        );
        setSource(nextState.source as 'live' | 'sample');
      }
    } catch (err) {
      const fallback = await mockFootballApi.getStandings(leagueId);
      setData(fallback);
      setSeasonUsed(null);
      setNotice(resolveFallbackNotice(provider, getFriendlyMessage(err)));
      setError(null);
      setSource('sample');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, notice, source, seasonUsed, refetch };
}

function getFriendlyMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    if (error.code === 'SUBSCRIPTION') {
      return 'Live standings are unavailable because the current API plan does not include this endpoint. Showing sample data instead.';
    }

    if (error.code === 'CONFIG') {
      return 'Live standings are unavailable because the API configuration is incomplete. Showing sample data instead.';
    }

    if (error.code === 'NETWORK') {
      return 'Live standings could not be reached right now. Showing sample data instead.';
    }
  }

  return 'Live standings are unavailable right now. Showing sample data instead.';
}

function getSeasonFallbackMessage(season: number) {
  return `Live standings connected successfully. Showing the latest available table from season ${season}.`;
}

function getEmptyStandingsMessage(season: number) {
  return `Live standings connected successfully, but no table rows were returned for season ${season}. Showing sample data instead.`;
}
