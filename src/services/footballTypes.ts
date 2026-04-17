export type MatchStatus = 'LIVE' | 'FT' | 'UPCOMING' | string;

export type Team = {
  id: number;
  name: string;
};

export type Match = {
  id: number;
  league: string;
  leagueId: number;
  home: string;
  away: string;
  time: string;
  timestamp: number;
  status: MatchStatus;
  score: string;
};

export type Standing = {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export type FootballDataProvider = 'mock' | 'live';

export type FootballApi = {
  getTodayMatches(date?: string): Promise<Match[]>;
};
