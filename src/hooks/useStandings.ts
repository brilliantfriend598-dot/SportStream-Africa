import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '@/src/lib/api/client';
import { getFootballDataProvider, getStandings } from '@/src/services/footballApi';
import { mockFootballApi } from '@/src/services/mockFootballApi';
import type { Standing } from '@/src/services/footballTypes';

export function useStandings(leagueId?: number) {
  const [data, setData] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(Boolean(leagueId));
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'sample'>('sample');

  const refetch = useCallback(async () => {
    if (!leagueId) return;
    const provider = getFootballDataProvider();
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const result = await getStandings(leagueId);
      if (result.length === 0) {
        const fallback = await mockFootballApi.getStandings(leagueId);
        setData(fallback);
        setNotice(provider === 'live' ? 'Live standings are unavailable right now. Showing sample data instead.' : null);
        setSource('sample');
      } else {
        setData(result);
        setSource(provider === 'live' ? 'live' : 'sample');
      }
    } catch (err) {
      const fallback = await mockFootballApi.getStandings(leagueId);
      setData(fallback);
      setNotice(provider === 'live' ? getFriendlyMessage(err) : null);
      setError(null);
      setSource('sample');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, notice, source, refetch };
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
