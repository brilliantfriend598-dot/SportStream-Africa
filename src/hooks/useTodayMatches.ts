import { useCallback, useEffect, useState } from 'react';
import { getTodayMatches } from '@/src/lib/api/football';
import { ApiClientError } from '@/src/lib/api/client';
import { mockMatches } from '@/src/lib/api/mock';
import type { MatchItem } from '@/src/lib/api/types';

export function useTodayMatches(date?: string) {
  const [data, setData] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [source, setSource] = useState<'live' | 'sample'>('live');

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotice(null);
      const result = await getTodayMatches(date);
      if (result.length === 0) {
        setData(mockMatches);
        setNotice(getEmptyStateMessage(date));
        setSource('sample');
      } else {
        setData(result);
        setSource('live');
      }
    } catch (err) {
      setData(mockMatches);
      setNotice(getFriendlyMessage(err, 'matches'));
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
