import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '@/src/lib/api/client';
import { getFootballDataProvider, getMatchDetails } from '@/src/services/footballApi';
import { resolveFallbackNotice, resolveNotFoundState } from '@/src/services/footballFallback';
import { mockFootballApi } from '@/src/services/mockFootballApi';
import type { MatchDetails } from '@/src/services/footballTypes';

export function useMatchDetails(matchId?: number) {
  const [data, setData] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(Boolean(matchId));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'sample'>('sample');

  const refetch = useCallback(async () => {
    if (!matchId) return;
    const provider = getFootballDataProvider();
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const result = await getMatchDetails(matchId);
      setData(result);
      setSource(provider === 'live' ? 'live' : 'sample');
    } catch (err) {
      if (err instanceof Error && err.message === 'Match not found') {
        const nextState = resolveNotFoundState(provider);
        setError(nextState.error);
        setData(null);
        setSource(nextState.source as 'live' | 'sample');
      } else {
        const fallback = await mockFootballApi.getMatchDetails(matchId);
        setData(fallback);
        setNotice(resolveFallbackNotice(provider, getFriendlyMessage(err)));
        setError(null);
        setSource('sample');
      }
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, notice, source, refetch };
}

function getFriendlyMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    if (error.code === 'SUBSCRIPTION') {
      return 'Live match details are unavailable because the current API plan does not include this endpoint. Showing sample data instead.';
    }

    if (error.code === 'CONFIG') {
      return 'Live match details are unavailable because the API configuration is incomplete. Showing sample data instead.';
    }

    if (error.code === 'NETWORK') {
      return 'Live match details could not be reached right now. Showing sample data instead.';
    }
  }

  return 'Live match details are unavailable right now. Showing sample data instead.';
}
