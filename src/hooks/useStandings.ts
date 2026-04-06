import { useCallback, useEffect, useState } from 'react';
import { getStandings } from '@/lib/api/football';
import type { StandingRow } from '@/lib/api/types';

export function useStandings(leagueId?: number) {
  const [data, setData] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(Boolean(leagueId));
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!leagueId) return;
    try {
      setLoading(true);
      setError(null);
      const result = await getStandings(leagueId);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load standings');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
