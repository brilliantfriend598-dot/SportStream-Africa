import { mockMatches } from '@/src/lib/api/mock';
import type { FootballApi, Match } from './footballTypes';

export const mockFootballApi: FootballApi = {
  async getTodayMatches() {
    return cloneMatches(mockMatches);
  },
};

function cloneMatches(matches: Match[]): Match[] {
  return matches.map((match) => ({ ...match }));
}
