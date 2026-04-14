export type ApiResponse<T> = {
  results: number;
  response: T;
  errors?: unknown;
};

export type ApiErrorCode = 'CONFIG' | 'SUBSCRIPTION' | 'NETWORK' | 'NOT_FOUND' | 'UNKNOWN';

export type MatchStatus = 'LIVE' | 'FT' | 'UPCOMING' | string;

export type MatchItem = {
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

export type MatchStat = {
  label: string;
  value: string;
};

export type MatchEvent = {
  time: string;
  detail: string;
};

export type MatchDetails = {
  id: number;
  league: string;
  home: string;
  away: string;
  score: string;
  status: MatchStatus;
  venue?: string;
  events: MatchEvent[];
  stats: MatchStat[];
};

export type StandingRow = {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  tag: string;
};
