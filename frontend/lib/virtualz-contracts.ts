// Virtualz Contract Interaction Functions
import { Transaction } from '@onelabs/sui/transactions';
import { PACKAGE_ID, GAME_STATE_ID, TOKEN_TREASURY_ID } from './virtualz-constants';

// ===== Faucet Functions =====

export function claimFaucet(tx: Transaction) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::claim_faucet`,
    arguments: [
      tx.object(TOKEN_TREASURY_ID),
    ],
  });
}

// ===== Season Functions =====

export function startSeason(tx: Transaction) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::start_season`,
    arguments: [
      tx.object(GAME_STATE_ID),
    ],
  });
}

// ===== Round Functions =====

export function startRound(tx: Transaction, seasonId: string) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::start_round`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.object(seasonId),
    ],
  });
}

export function finalizeRound(tx: Transaction, seasonId: string, roundId: string) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::finalize_round`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.object(seasonId),
      tx.object(roundId),
    ],
  });
}

// ===== Betting Functions =====

export function placeBet(
  tx: Transaction,
  seasonId: string,
  roundId: string,
  leagueCoinId: string,
  matchIds: number[],
  betTypes: number[]
) {
  const coin = tx.object(leagueCoinId);

  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::place_bet`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.object(seasonId),
      tx.object(roundId),
      coin,
      tx.pure.vector('u8', matchIds),
      tx.pure.vector('u8', betTypes),
    ],
  });
}

export function claimBet(tx: Transaction, roundId: string, betSlipId: string) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::claim_bet`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.object(roundId),
      tx.object(betSlipId),
    ],
  });
}

// ===== Season Prediction Functions =====

export function predictSeasonWinner(tx: Transaction, seasonId: string, teamId: number) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::predict_season_winner`,
    arguments: [
      tx.object(seasonId),
      tx.pure.u8(teamId),
    ],
  });
}

export function claimSeasonPrediction(tx: Transaction, seasonId: string, predictionId: string) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::claim_season_prediction`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.object(seasonId),
      tx.object(predictionId),
    ],
  });
}

// ===== View Functions =====

export function getSeasonInfo(tx: Transaction, seasonId: string) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_season_info`,
    arguments: [tx.object(seasonId)],
  });
}

export function getRoundInfo(tx: Transaction, roundId: string) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_round_info`,
    arguments: [tx.object(roundId)],
  });
}

export function getMatchInfo(tx: Transaction, roundId: string, matchId: number) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_match_info`,
    arguments: [
      tx.object(roundId),
      tx.pure.u8(matchId),
    ],
  });
}

export function getAllMatches(tx: Transaction, roundId: string) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_all_matches`,
    arguments: [tx.object(roundId)],
  });
}

export function getTeamPoints(tx: Transaction, seasonId: string, teamId: number) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_team_points`,
    arguments: [
      tx.object(seasonId),
      tx.pure.u8(teamId),
    ],
  });
}

export function getGameStats(tx: Transaction) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_game_stats`,
    arguments: [tx.object(GAME_STATE_ID)],
  });
}

export function getTeamName(tx: Transaction, teamId: number) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_team_name`,
    arguments: [tx.pure.u8(teamId)],
  });
}

export function getLeaderboard(tx: Transaction, seasonId: string) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::get_leaderboard`,
    arguments: [tx.object(seasonId)],
  });
}

// ===== Admin Functions =====

export function updateOperator(tx: Transaction, newOperator: string) {
  tx.moveCall({
    target: `${PACKAGE_ID}::ivirtualz::update_operator`,
    arguments: [
      tx.object(GAME_STATE_ID),
      tx.pure.address(newOperator),
    ],
  });
}

// ===== Coin Management Functions =====

export async function splitCoin(tx: Transaction, coinId: string, amount: number) {
  const [coin] = tx.splitCoins(tx.object(coinId), [tx.pure.u64(amount)]);
  return coin;
}

export async function mergeCoin(tx: Transaction, targetCoinId: string, sourceCoinId: string) {
  tx.mergeCoins(tx.object(targetCoinId), [tx.object(sourceCoinId)]);
}
