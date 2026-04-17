import type { Match, MatchDetails, Standing } from './footballTypes';

export const mockMatches: Match[] = [
  {
    id: 1,
    league: 'Premier League',
    leagueId: 39,
    home: 'Arsenal',
    away: 'Chelsea',
    time: '20:30',
    timestamp: Date.now(),
    status: 'LIVE',
    score: '2 - 1',
  },
  {
    id: 2,
    league: 'Champions League',
    leagueId: 2,
    home: 'Real Madrid',
    away: 'Bayern',
    time: '21:00',
    timestamp: Date.now(),
    status: 'UPCOMING',
    score: 'vs',
  },
];

export const mockMatchDetails: MatchDetails = {
  id: 1,
  league: 'Premier League',
  home: 'Arsenal',
  away: 'Chelsea',
  score: '2 - 1',
  status: 'LIVE',
  venue: 'Emirates Stadium',
  events: [
    { time: "12'", detail: 'Goal Arsenal' },
    { time: "37'", detail: 'Goal Chelsea' },
    { time: "68'", detail: 'Goal Arsenal' },
  ],
  stats: [
    { label: 'Possession', value: '58%' },
    { label: 'Shots', value: '14' },
    { label: 'On Target', value: '6' },
    { label: 'Corners', value: '7' },
  ],
};

export const mockStandings: Standing[] = [
  { rank: 1, team: 'Arsenal', played: 28, won: 20, drawn: 5, lost: 3, points: 65 },
  { rank: 2, team: 'Liverpool', played: 28, won: 19, drawn: 6, lost: 3, points: 63 },
];
