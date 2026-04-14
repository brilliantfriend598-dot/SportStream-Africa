export type Match = {
  id: string;
  league: string;
  home: string;
  away: string;
  time: string;
  status: 'LIVE' | 'UPCOMING' | 'FT';
  score: string;
  events: string[];
  stats: { label: string; value: string }[];
};

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  tag: string;
};

export type VideoItem = {
  id: string;
  title: string;
  duration: string;
  tag: string;
};

export const matches: Match[] = [
  {
    id: '1',
    league: 'Premier League',
    home: 'Arsenal',
    away: 'Chelsea',
    time: '20:30',
    status: 'LIVE',
    score: '2 - 1',
    events: ["12' Goal Arsenal", "37' Goal Chelsea", "68' Goal Arsenal"],
    stats: [
      { label: 'Possession', value: '58%' },
      { label: 'Shots', value: '14' },
      { label: 'On Target', value: '6' },
      { label: 'Corners', value: '7' },
    ],
  },
  {
    id: '2',
    league: 'Champions League',
    home: 'Real Madrid',
    away: 'Bayern',
    time: '21:00',
    status: 'UPCOMING',
    score: 'vs',
    events: [],
    stats: [
      { label: 'Form', value: 'W-W-D' },
      { label: 'Ranking', value: '#2' },
      { label: 'Venue', value: 'Bernabeu' },
      { label: 'Ref', value: 'TBC' },
    ],
  },
  {
    id: '3',
    league: 'PSL',
    home: 'Sundowns',
    away: 'Chiefs',
    time: '18:00',
    status: 'FT',
    score: '1 - 0',
    events: ["55' Goal Sundowns"],
    stats: [
      { label: 'Possession', value: '61%' },
      { label: 'Shots', value: '11' },
      { label: 'On Target', value: '4' },
      { label: 'Corners', value: '5' },
    ],
  },
];

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Title race heats up after dramatic late winner',
    summary: 'A crucial result reshapes the table heading into the weekend fixtures.',
    tag: 'Trending',
  },
  {
    id: '2',
    title: 'Champions League quarter-final lineups confirmed',
    summary: 'Managers reveal final squads ahead of the biggest matchups this week.',
    tag: 'Europe',
  },
  {
    id: '3',
    title: 'PSL spotlight: local form players to watch',
    summary: 'Three standout players are driving momentum for their clubs.',
    tag: 'Africa',
  },
];

export const videoItems: VideoItem[] = [
  { id: '1', title: 'Top 5 goals this week', duration: '02:18', tag: 'Highlights' },
  { id: '2', title: 'Matchday tactical breakdown', duration: '03:44', tag: 'Analysis' },
  { id: '3', title: 'PSL weekend recap', duration: '01:56', tag: 'Africa' },
];
