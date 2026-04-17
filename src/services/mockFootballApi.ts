import { mockMatchDetails, mockMatches, mockStandings } from './footballMockData';
import type { FootballApi, Match, MatchDetails, Standing } from './footballTypes';

export const mockFootballApi: FootballApi = {
  async getTodayMatches() {
    return cloneMatches(mockMatches);
  },
  async getMatchDetails(matchId: number) {
    return { ...mockMatchDetails, id: matchId };
  },
  async getStandings() {
    return cloneStandings(mockStandings);
  },
};

function cloneMatches(matches: Match[]): Match[] {
  return matches.map((match) => ({ ...match }));
}

function cloneStandings(standings: Standing[]): Standing[] {
  return standings.map((row) => ({ ...row }));
}
