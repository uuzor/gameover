'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@onelabs/dapp-kit';
import { Transaction } from '@onelabs/sui/transactions';
import {
  TEAMS,
  BET_TYPES,
  BET_TYPE_LABELS,
  getTeamName,
  getTeamShortName,
  getTeamColor,
  formatLeague,
  calculatePotentialPayout,
  formatTimeRemaining,
} from '@/lib/virtualz-constants';
import { claimFaucet, placeBet } from '@/lib/virtualz-contracts';

interface Match {
  matchId: number;
  homeTeam: number;
  awayTeam: number;
  homeScore: number;
  awayScore: number;
  isFinished: boolean;
}

interface BetSelection {
  matchId: number;
  betType: number;
}

export default function HomePage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const [matches, setMatches] = useState<Match[]>([]);
  const [betSlip, setBetSlip] = useState<BetSelection[]>([]);
  const [stakeAmount, setStakeAmount] = useState('1');
  const [currentRound, setCurrentRound] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState('15:00');
  const [isClaiming, setIsClaiming] = useState(false);

  // Mock data for demonstration (replace with actual contract data)
  useEffect(() => {
    // Generate mock matches
    const mockMatches: Match[] = [
      { matchId: 1, homeTeam: 1, awayTeam: 2, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 2, homeTeam: 3, awayTeam: 4, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 3, homeTeam: 5, awayTeam: 6, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 4, homeTeam: 7, awayTeam: 8, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 5, homeTeam: 9, awayTeam: 10, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 6, homeTeam: 11, awayTeam: 12, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 7, homeTeam: 13, awayTeam: 14, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 8, homeTeam: 15, awayTeam: 16, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 9, homeTeam: 17, awayTeam: 18, homeScore: 0, awayScore: 0, isFinished: false },
      { matchId: 10, homeTeam: 19, awayTeam: 20, homeScore: 0, awayScore: 0, isFinished: false },
    ];
    setMatches(mockMatches);

    // Timer countdown
    const endTime = Date.now() + 900000; // 15 minutes
    const interval = setInterval(() => {
      setTimeRemaining(formatTimeRemaining(endTime));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleClaimFaucet = async () => {
    if (!account) return;
    setIsClaiming(true);

    try {
      const tx = new Transaction();
      claimFaucet(tx);

      signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            alert('Successfully claimed 100 LEAGUE tokens!');
          },
          onError: (error) => {
            console.error('Error claiming faucet:', error);
            alert('Failed to claim faucet');
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const handleBetSelection = (matchId: number, betType: number) => {
    const existing = betSlip.findIndex((bet) => bet.matchId === matchId);

    if (existing >= 0) {
      // If same bet type, remove it; otherwise update
      const newBetSlip = [...betSlip];
      if (newBetSlip[existing].betType === betType) {
        newBetSlip.splice(existing, 1);
      } else {
        newBetSlip[existing].betType = betType;
      }
      setBetSlip(newBetSlip);
    } else {
      // Add new bet
      setBetSlip([...betSlip, { matchId, betType }]);
    }
  };

  const handlePlaceBet = async () => {
    if (!account || betSlip.length === 0) return;

    try {
      const tx = new Transaction();
      const stake = parseFloat(stakeAmount) * 1_000_000_000;

      // Get user's LEAGUE coin (mock - replace with actual coin selection)
      const matchIds = betSlip.map((bet) => bet.matchId);
      const betTypes = betSlip.map((bet) => bet.betType);

      // Note: You'll need to implement coin selection logic
      // For now, this is a placeholder
      // placeBet(tx, SEASON_ID, ROUND_ID, COIN_ID, matchIds, betTypes);

      alert('Bet placement functionality - connect to deployed contract');
    } catch (error) {
      console.error('Error placing bet:', error);
      alert('Failed to place bet');
    }
  };

  const clearBetSlip = () => {
    setBetSlip([]);
  };

  const potentialPayout = calculatePotentialPayout(
    parseFloat(stakeAmount) * 1_000_000_000,
    betSlip.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-md border-b border-green-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                ⚽ VIRTUALZ
              </h1>
              <p className="text-green-300 text-sm">Premier League Virtual Betting</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <p className="text-sm text-green-300">Season 1 • Round {currentRound}</p>
                <p className="text-xl font-bold text-yellow-400">{timeRemaining}</p>
              </div>
              {account ? (
                <button
                  onClick={handleClaimFaucet}
                  disabled={isClaiming}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                >
                  {isClaiming ? 'Claiming...' : 'Get 100 LEAGUE'}
                </button>
              ) : (
                <p className="text-yellow-400">Connect Wallet to Play</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Matches Section */}
          <div className="lg:col-span-2">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-green-500/30">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-green-400">⚡</span> Live Matches
              </h2>

              <div className="space-y-4">
                {matches.map((match) => (
                  <div
                    key={match.matchId}
                    className="bg-black/50 rounded-lg p-4 border border-green-500/20 hover:border-green-500/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-green-300 text-sm font-medium">
                        Match {match.matchId}
                      </span>
                      {match.isFinished && (
                        <span className="bg-green-500 text-black text-xs px-2 py-1 rounded">
                          FT
                        </span>
                      )}
                    </div>

                    {/* Teams */}
                    <div className="grid grid-cols-3 gap-4 items-center mb-4">
                      <div className="text-right">
                        <p className="font-bold text-lg">{getTeamName(match.homeTeam)}</p>
                        <p className="text-green-300 text-sm">{getTeamShortName(match.homeTeam)}</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-black/70 rounded-lg py-2 px-4">
                          <span className="text-3xl font-bold text-yellow-400">
                            {match.homeScore} - {match.awayScore}
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-lg">{getTeamName(match.awayTeam)}</p>
                        <p className="text-green-300 text-sm">{getTeamShortName(match.awayTeam)}</p>
                      </div>
                    </div>

                    {/* Betting Options */}
                    {!match.isFinished && (
                      <div className="grid grid-cols-3 gap-2">
                        {[BET_TYPES.HOME_WIN, BET_TYPES.DRAW, BET_TYPES.AWAY_WIN].map((betType) => {
                          const isSelected = betSlip.some(
                            (bet) => bet.matchId === match.matchId && bet.betType === betType
                          );
                          return (
                            <button
                              key={betType}
                              onClick={() => handleBetSelection(match.matchId, betType)}
                              className={`py-3 px-4 rounded-lg font-bold transition-all ${
                                isSelected
                                  ? 'bg-green-500 text-black'
                                  : 'bg-black/70 hover:bg-green-500/20 border border-green-500/30'
                              }`}
                            >
                              <div className="text-xs mb-1">
                                {betType === BET_TYPES.HOME_WIN
                                  ? '1'
                                  : betType === BET_TYPES.DRAW
                                  ? 'X'
                                  : '2'}
                              </div>
                              <div className="text-lg">2.00</div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bet Slip Section */}
          <div className="lg:col-span-1">
            <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-yellow-500/30 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-yellow-400">🎫</span> Bet Slip
              </h2>

              {betSlip.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="mb-2">No bets selected</p>
                  <p className="text-sm">Click on odds to add to bet slip</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {betSlip.map((bet) => {
                      const match = matches.find((m) => m.matchId === bet.matchId);
                      if (!match) return null;

                      return (
                        <div
                          key={bet.matchId}
                          className="bg-black/50 rounded-lg p-3 border border-yellow-500/20"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-yellow-300">Match {match.matchId}</p>
                              <p className="font-bold text-sm">
                                {getTeamShortName(match.homeTeam)} vs{' '}
                                {getTeamShortName(match.awayTeam)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleBetSelection(bet.matchId, bet.betType)}
                              className="text-red-400 hover:text-red-300 text-xl leading-none"
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-400 font-bold">
                              {BET_TYPE_LABELS[bet.betType as keyof typeof BET_TYPE_LABELS]}
                            </span>
                            <span className="text-yellow-400 font-bold">2.00</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-yellow-300 mb-2">Stake Amount</label>
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        min="0.1"
                        step="0.1"
                        className="w-full bg-black/70 border border-yellow-500/30 rounded-lg px-4 py-3 text-white focus:border-yellow-500 focus:outline-none"
                        placeholder="Enter amount in LEAGUE"
                      />
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-yellow-300">Total Selections:</span>
                        <span className="font-bold">{betSlip.length}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-yellow-300">Multiplier:</span>
                        <span className="font-bold text-green-400">
                          {betSlip.length === 1 ? '2x' : `${Math.pow(2, betSlip.length)}x`}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-yellow-500/30 pt-2 mt-2">
                        <span className="text-yellow-300">Potential Win:</span>
                        <span className="text-yellow-400">{formatLeague(potentialPayout)} LEAGUE</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={clearBetSlip}
                        className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 font-bold py-3 rounded-lg transition-all"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handlePlaceBet}
                        disabled={!account}
                        className="bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Place Bet
                      </button>
                    </div>

                    {!account && (
                      <p className="text-center text-yellow-300 text-sm">
                        Connect wallet to place bets
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Info Card */}
            <div className="mt-6 bg-black/30 backdrop-blur-md rounded-xl p-6 border border-blue-500/30">
              <h3 className="text-lg font-bold mb-3 text-blue-300">How It Works</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ 10 matches every 15 minutes</li>
                <li>✓ Single bet: 2x multiplier</li>
                <li>✓ Multi-bet: 2^n multiplier</li>
                <li>✓ 30% rewards to early users</li>
                <li>✓ Season winner: 2% prize pool</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
