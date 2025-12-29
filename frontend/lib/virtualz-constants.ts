// Virtualz Premier League Virtual Betting Game Constants (OneChain)

export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || ''
export const GAME_STATE_ID = process.env.NEXT_PUBLIC_GAME_STATE_ID || ''
export const TOKEN_TREASURY_ID = process.env.NEXT_PUBLIC_TOKEN_TREASURY_ID || ''
export const CURRENT_SEASON_ID = process.env.NEXT_PUBLIC_CURRENT_SEASON_ID || ''

// Game constants
export const ROUND_DURATION_MS = 900000; // 15 minutes
export const MATCHES_PER_ROUND = 10;
export const TEAMS_COUNT = 20;
export const ROUNDS_PER_SEASON = 36;
export const MIN_BET_AMOUNT = 100_000_000; // 0.1 LEAGUE

// Bet types
export const BET_TYPES = {
  HOME_WIN: 1,
  AWAY_WIN: 2,
  DRAW: 3,
} as const;

export const BET_TYPE_LABELS = {
  [BET_TYPES.HOME_WIN]: '1 (Home Win)',
  [BET_TYPES.AWAY_WIN]: '2 (Away Win)',
  [BET_TYPES.DRAW]: 'X (Draw)',
} as const;

// Reward percentages
export const EARLY_USER_REWARD_PERCENTAGE = 30; // 30% to early users
export const SEASON_WINNER_REWARD_PERCENTAGE = 2; // 2% for season winner prediction

// Premier League Teams
export const TEAMS = [
  { id: 1, name: 'Manchester United', shortName: 'MUN', color: '#DA291C' },
  { id: 2, name: 'Liverpool', shortName: 'LIV', color: '#C8102E' },
  { id: 3, name: 'Manchester City', shortName: 'MCI', color: '#6CABDD' },
  { id: 4, name: 'Arsenal', shortName: 'ARS', color: '#EF0107' },
  { id: 5, name: 'Chelsea', shortName: 'CHE', color: '#034694' },
  { id: 6, name: 'Tottenham', shortName: 'TOT', color: '#132257' },
  { id: 7, name: 'Newcastle', shortName: 'NEW', color: '#241F20' },
  { id: 8, name: 'Aston Villa', shortName: 'AVL', color: '#95BFE5' },
  { id: 9, name: 'Brighton', shortName: 'BHA', color: '#0057B8' },
  { id: 10, name: 'West Ham', shortName: 'WHU', color: '#7A263A' },
  { id: 11, name: 'Everton', shortName: 'EVE', color: '#003399' },
  { id: 12, name: 'Leicester', shortName: 'LEI', color: '#003090' },
  { id: 13, name: 'Wolves', shortName: 'WOL', color: '#FDB913' },
  { id: 14, name: 'Crystal Palace', shortName: 'CRY', color: '#1B458F' },
  { id: 15, name: 'Fulham', shortName: 'FUL', color: '#000000' },
  { id: 16, name: 'Brentford', shortName: 'BRE', color: '#E30613' },
  { id: 17, name: 'Bournemouth', shortName: 'BOU', color: '#DA291C' },
  { id: 18, name: 'Nottingham Forest', shortName: 'NFO', color: '#DD0000' },
  { id: 19, name: 'Luton Town', shortName: 'LUT', color: '#F78F1E' },
  { id: 20, name: 'Burnley', shortName: 'BUR', color: '#6C1D45' },
] as const;

// Helper functions
export function getTeamById(id: number) {
  return TEAMS.find(team => team.id === id);
}

export function getTeamName(id: number): string {
  return getTeamById(id)?.name || 'Unknown';
}

export function getTeamShortName(id: number): string {
  return getTeamById(id)?.shortName || 'UNK';
}

export function getTeamColor(id: number): string {
  return getTeamById(id)?.color || '#666666';
}

export function formatLeague(amount: number): string {
  return (amount / 1_000_000_000).toFixed(2);
}

export function parseLeague(amount: string): number {
  return Math.floor(parseFloat(amount) * 1_000_000_000);
}

export function calculateMultiplier(predictionsCount: number): number {
  if (predictionsCount === 1) return 2;
  return Math.pow(2, predictionsCount);
}

export function calculatePotentialPayout(stake: number, predictionsCount: number): number {
  return stake * calculateMultiplier(predictionsCount);
}

export function getMatchResult(homeScore: number, awayScore: number): number {
  if (homeScore > awayScore) return BET_TYPES.HOME_WIN;
  if (awayScore > homeScore) return BET_TYPES.AWAY_WIN;
  return BET_TYPES.DRAW;
}

export function formatTimeRemaining(endTime: number): string {
  const now = Date.now();
  const remaining = endTime - now;

  if (remaining <= 0) return 'Finished';

  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
