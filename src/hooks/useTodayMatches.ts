import { useCallback, useEffect, useState } from 'react';
import { getTodayMatches } from '@/src/lib/api/football';
import type { MatchItem } from '@/src/lib/api/types';

export function useTodayMatches(date?: string) {
  const [data, setData] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getTodayMatches(date);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
