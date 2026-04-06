import { useCallback, useEffect, useState } from 'react';
import { getMatchDetails } from '@/lib/api/football';
import type { MatchDetails } from '@/lib/api/types';

export function useMatchDetails(matchId?: number) {
  const [data, setData] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(Boolean(matchId));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!matchId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getMatchDetails(matchId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load match');
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
