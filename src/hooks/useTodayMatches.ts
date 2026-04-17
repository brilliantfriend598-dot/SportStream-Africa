import { useCallback, useEffect, useState } from 'react';
import { ApiClientError } from '@/src/lib/api/client';
import { getFootballDataProvider, getTodayMatches } from '@/src/services/footballApi';
import { resolveFallbackNotice, resolveListFetchState } from '@/src/services/footballFallback';
import { mockFootballApi } from '@/src/services/mockFootballApi';
import type { Match } from '@/src/services/footballTypes';

export function useTodayMatches(date?: string) {
  const [data, setData] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'sample'>('sample');

  const refetch = useCallback(async () => {
    const provider = getFootballDataProvider();

    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const result = await getTodayMatches(date);
      if (result.length === 0) {
        const fallbackMatches = await mockFootballApi.getTodayMatches(date);
        const nextState = resolveListFetchState(provider, false, getEmptyStateMessage(date), null);
        setData(fallbackMatches);
        setNotice(nextState.notice);
        setSource(nextState.source as 'live' | 'sample');
      } else {
        const nextState = resolveListFetchState(provider, true, null, null);
        setData(result);
        setSource(nextState.source as 'live' | 'sample');
      }
    } catch (err) {
      const fallbackMatches = await mockFootballApi.getTodayMatches(date);
      setData(fallbackMatches);
      setNotice(resolveFallbackNotice(provider, getFriendlyMessage(err, 'matches')));
      setError(null);
      setSource('sample');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, notice, source, refetch };
}

function getFriendlyMessage(error: unknown, subject: string) {
  if (error instanceof ApiClientError) {
    if (error.code === 'SUBSCRIPTION') {
      return `Live ${subject} are unavailable because the current API plan does not include this endpoint. Showing sample data instead.`;
    }

    if (error.code === 'CONFIG') {
      return `Live ${subject} are unavailable because the API configuration is incomplete. Showing sample data instead.`;
    }

    if (error.code === 'NETWORK') {
      return `Live ${subject} could not be reached right now. Showing sample data instead.`;
    }
  }

  return `Live ${subject} are unavailable right now. Showing sample data instead.`;
}

function getEmptyStateMessage(date?: string) {
  const label = date ?? 'today';
  return `The live API returned no fixtures for ${label}. Showing sample data instead.`;
}
