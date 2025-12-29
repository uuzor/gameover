<div align="center">

# ⚽ VIRTUALZ - Premier League Virtual Betting Platform

### *Powered by Randomness, Driven by Excitement*

[![OneChain](https://img.shields.io/badge/OneChain-Blockchain-4DA2FF?style=for-the-badge&logo=sui&logoColor=white)](https://onelabs.cc)
[![Move](https://img.shields.io/badge/Move-Smart%20Contract-FF5733?style=for-the-badge)](https://docs.sui.io/build/move)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

[🎮 Play Now](#) • [📖 Documentation](#-game-features) • [🚀 Quick Start](#-quick-start)

</div>

---

## 🌟 Overview

**VIRTUALZ** is a revolutionary Premier League virtual betting platform built on OneChain. Experience the thrill of betting on virtual matches with provably fair randomness, multi-bet accumulators, and seasonal competitions - all powered by blockchain technology!

### ✨ Key Highlights

- ⚽ **20 Premier League Teams** - All your favorite teams in virtual action
- 🎲 **Provably Fair Randomness** - Transparent match generation and scoring
- 💰 **Multi-Bet System** - High-risk, high-reward accumulator bets
- 🏆 **Seasonal Competition** - 36 rounds per season with leaderboards
- 💎 **$LEAGUE Token** - Platform currency for betting
- 🎁 **30% Early User Rewards** - Share in platform earnings
- 🏅 **Season Winner Prediction** - Free predictions for 2% prize pool
- 📱 **Responsive Design** - Play on desktop or mobile

---

## 🎮 Game Features

### ⚽ Virtual Match System

**Continuous Gameplay**
- 🕐 **10 Matches Every 15 Minutes** - Non-stop action
- 🎲 **Random Team Matching** - Unpredictable matchups
- 📊 **Random Score Generation** - Provably fair results (0-5 goals)
- ⚡ **Real-time Updates** - Live scores and countdowns
- 🔄 **Automated System** - Off-chain node manages rounds

**Match Outcomes**
```
Home Win (1) - Home team scores > Away team
Away Win (2) - Away team scores > Home team
Draw (X)     - Equal scores
```

### 💰 Betting System

**Single Bets**
- 💵 Bet on individual match outcomes
- 📈 **2x Multiplier** on stake
- ✅ Simple and straightforward

**Multi-Bet Accumulators**
- 🎯 Combine multiple predictions in one bet slip
- 🚀 **Exponential Multiplier**: 2^n (where n = number of predictions)
- ⚠️ **All predictions must be correct** to win
- 💎 Higher risk = Higher reward

**Multiplier Examples**
| Predictions | Multiplier | Stake 1 LEAGUE | Potential Win |
|------------|------------|----------------|---------------|
| 1 match    | 2x         | 1 LEAGUE       | 2 LEAGUE      |
| 2 matches  | 4x         | 1 LEAGUE       | 4 LEAGUE      |
| 3 matches  | 8x         | 1 LEAGUE       | 8 LEAGUE      |
| 5 matches  | 32x        | 1 LEAGUE       | 32 LEAGUE     |
| 10 matches | 1024x      | 1 LEAGUE       | 1024 LEAGUE   |

### 🏆 Seasonal System

**Season Structure**
- 📅 **36 Rounds per Season** - Each round lasts 15 minutes
- 🎯 **Continuous Play** - Seamless round transitions
- 📊 **League Table** - Teams earn points (Win: 3pts, Draw: 1pt)
- 👑 **Season Winner** - Team with most points at season end

**Season Winner Prediction**
- 🆓 **Free to Enter** - No cost to predict
- 🎰 **2% Prize Pool** - Share of total season volume
- 📈 **Early Prediction Bonus** - Predict before season ends
- 💰 **Shared Rewards** - Winners split the prize pool

### 💎 $LEAGUE Token

**Token Utility**
- 🎫 **Betting Currency** - Place bets with LEAGUE or native token
- 💸 **Platform Earnings** - Earn from successful bets
- 🎁 **Reward Distribution** - Receive early user bonuses
- 🏆 **Season Prizes** - Win from predictions

**Revenue Distribution**
```
Bet Placed → 30% Early User Rewards Pool
          → 70% Treasury (for payouts)

Season Volume → 2% Season Winner Pool
             → 98% Treasury
```

### 🎁 Early User Rewards

**30% Reward Pool**
- 💰 **30% of all bets** go to early user rewards
- 🎯 Active bettors receive bonus rewards
- 📈 Additional 10% bonus on winning payouts
- ⚡ Automatic distribution on bet claims

---

## 🏗️ Smart Contract Architecture

### Core Components

**IVirtualz Module** (`virtualz::ivirtualz`)

**Main Structs:**
- `GameState` - Global platform state and treasury
- `Season` - Seasonal data with team points
- `Round` - 10 matches per round with results
- `Match` - Individual match data
- `BetSlip` - User bet with predictions
- `SeasonWinnerPrediction` - Free season prediction
- `TokenTreasury` - LEAGUE token minting

**Key Functions:**

*For Players:*
```move
claim_faucet() - Get 100 LEAGUE tokens
place_bet() - Place single or multi-bet
claim_bet() - Claim winnings from winning bets
predict_season_winner() - Free season prediction
claim_season_prediction() - Claim season prize
```

*For Operators (Off-chain Node):*
```move
start_season() - Initialize new season
start_round() - Begin new round with random matches
finalize_round() - Generate scores and update points
```

*View Functions (Frontend-Friendly):*
```move
get_season_info() - Season data
get_round_info() - Round details
get_all_matches() - All matches in round
get_team_points() - Team standings
get_game_stats() - Platform statistics
get_team_name() - Team information
```

---

## 📊 Game Economics

### Revenue Model

**Income Streams:**
1. 📈 **Betting Volume** - All bets contribute to treasury
2. 💰 **Losing Bets** - Unsuccessful bets stay in treasury
3. 🔄 **Continuous Rounds** - 96 rounds per day (15min each)

**Payout Structure:**
1. ✅ **Winning Bets** - Paid from treasury
2. 🎁 **Early User Bonus** - 10% extra from reward pool
3. 🏆 **Season Prizes** - 2% of season volume

### Sustainability

**Treasury Management:**
- Losing bets fund winning payouts
- 30% dedicated to player rewards
- Balanced odds (2.00 across all outcomes)
- House edge from multi-bet variance

**Player Benefits:**
- Fair 2x odds on single bets
- Exponential multi-bet multipliers
- Early user reward sharing
- Free season predictions

---

## 🚀 Quick Start

### 📋 Prerequisites

- ✅ [OneChain Wallet](https://onewallet.app/) or Sui Wallet
- ✅ Testnet OCT from [OneChain Faucet](https://faucet.onelabs.cc/)
- ✅ Node.js 18+ (for local development)
- ✅ Sui CLI (for contract deployment)

### 🎮 Play Now (Easiest)

1. **Connect Wallet** - Use OneWallet or Sui Wallet
2. **Get Test OCT** - From OneChain faucet (for gas)
3. **Claim LEAGUE** - Click "Get 100 LEAGUE" in app
4. **Place Bets** - Select matches and bet!

### 💻 Local Development

#### Step 1: Clone & Install

```bash
git clone <your-repo-url>
cd gameover

# Install frontend dependencies
cd frontend
npm install
```

#### Step 2: Deploy Smart Contract

```bash
# Build Move package
sui move build

# Deploy to OneChain testnet
sui client publish --gas-budget 100000000

# Save these values:
# - Package ID
# - GameState Object ID
# - TokenTreasury Object ID
```

#### Step 3: Configure Frontend

```bash
cd frontend

# Create environment file
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_PACKAGE_ID=<your_package_id>
NEXT_PUBLIC_GAME_STATE_ID=<your_game_state_id>
NEXT_PUBLIC_TOKEN_TREASURY_ID=<your_token_treasury_id>
```

#### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

---

## 📁 Project Structure

```
gameover/
├── sources/
│   └── virtualz.move           # Main smart contract
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Main betting interface
│   │   └── layout.tsx          # App layout
│   ├── lib/
│   │   ├── virtualz-constants.ts   # Game constants & teams
│   │   └── virtualz-contracts.ts   # Contract interactions
│   └── package.json
├── Move.toml                   # Move package config
└── README.md
```

---

## 🎯 How to Play

### 1. Get LEAGUE Tokens
- Connect your wallet
- Click "Get 100 LEAGUE" to claim from faucet
- Check your balance

### 2. Place Bets

**Single Bet:**
1. Click on odds (1, X, or 2) for any match
2. Enter stake amount
3. Click "Place Bet"
4. Potential payout: Stake × 2

**Multi-Bet (Accumulator):**
1. Select outcomes for multiple matches
2. See multiplier increase (2^n)
3. Enter stake amount
4. Click "Place Bet"
5. All predictions must be correct to win!

### 3. Wait for Round to Finish
- Watch timer countdown (15 minutes)
- Matches finalize automatically
- Scores are generated randomly

### 4. Claim Winnings
- Go to "My Bets" section
- Click "Claim" on winning bets
- Receive payout + early user bonus!

### 5. Predict Season Winner
- View league table
- Choose team likely to win season
- Free entry - just pay gas
- Win share of 2% season prize pool

---

## 🏅 Premier League Teams

<table>
<tr>
<td width="50%">

**Classic Teams**
1. 🔴 Manchester United
2. 🔴 Liverpool
3. 🔵 Manchester City
4. 🔴 Arsenal
5. 🔵 Chelsea
6. ⚪ Tottenham
7. ⚫ Newcastle
8. 🟣 Aston Villa
9. 🔵 Brighton
10. 🔴 West Ham

</td>
<td width="50%">

**More Teams**
11. 🔵 Everton
12. 🔵 Leicester
13. 🟡 Wolves
14. 🔵 Crystal Palace
15. ⚫ Fulham
16. 🔴 Brentford
17. 🔴 Bournemouth
18. 🔴 Nottingham Forest
19. 🟠 Luton Town
20. 🟣 Burnley

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

### ⛓️ Blockchain Layer
- **[OneChain](https://onelabs.cc)** - High-performance Sui-based blockchain
- **[Move Language](https://docs.sui.io/build/move)** - Secure smart contracts
- **Provably Fair Randomness** - On-chain random generation

### 🎨 Frontend Stack
- **[Next.js 14](https://nextjs.org)** - React framework
- **[TypeScript](https://typescriptlang.org)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[@onelabs/dapp-kit](https://sdk.onelabs.cc)** - Wallet integration
- **[@tanstack/react-query](https://tanstack.com/query)** - Data management

---

## 🎲 Randomness & Fairness

### Provably Fair System

**Match Generation:**
```move
// Random team pairing
let random = pseudo_random(ctx);
let home_team = (random % 20) + 1;
let away_team = ((random / 100) % 20) + 1;
```

**Score Generation:**
```move
// Random scores (0-5 goals each)
let random = pseudo_random(ctx);
let home_score = (random % 6) as u8;
let away_score = ((random / 10) % 6) as u8;
```

**Randomness Source:**
- Uses Sui's object UID for entropy
- On-chain and verifiable
- Cannot be predicted or manipulated
- Each transaction has unique randomness

---

## 📈 Roadmap

### ✅ Phase 1: Foundation (Completed)
- [x] Smart contract development
- [x] LEAGUE token implementation
- [x] Random match & score generation
- [x] Single bet system
- [x] Multi-bet accumulator system
- [x] Seasonal competition
- [x] Season winner prediction
- [x] Early user rewards (30%)
- [x] Frontend betting interface

### 🚧 Phase 2: Enhancement (In Progress)
- [ ] Deploy to OneChain Testnet
- [ ] Off-chain operator node
- [ ] Automated round management
- [ ] Historical bet tracking
- [ ] User statistics dashboard
- [ ] Live leaderboards

### 🔮 Phase 3: Advanced Features (Q1 2025)
- [ ] Live match animations
- [ ] Sound effects and music
- [ ] Push notifications
- [ ] Bet history & analytics
- [ ] Social sharing
- [ ] Referral system

### 🚀 Phase 4: Scale (Q2 2025)
- [ ] Mainnet deployment
- [ ] Mobile app (iOS & Android)
- [ ] Multiple leagues (La Liga, Serie A, etc.)
- [ ] Tournament modes
- [ ] VIP tiers
- [ ] DAO governance

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## ⚠️ Disclaimer

This is a testnet project for educational and demonstration purposes.

- 🧪 Currently on **OneChain Testnet**
- 💰 Uses **test LEAGUE tokens** (no real value)
- 🔒 Smart contracts **not audited**
- 🎮 Play responsibly
- 📝 Not financial advice

---

## 🔗 Important Links

- 🌐 **Live Demo**: Coming Soon
- 📱 **GitHub**: [Source Code](https://github.com/yourusername/virtualz)
- 📊 **OneChain Explorer**: [View Contracts](https://explorer.onelabs.cc)
- 💬 **Discord**: Coming Soon
- 🐦 **Twitter**: Coming Soon

---

## 🙏 Acknowledgments

- **[OneChain](https://onelabs.cc)** - For an amazing blockchain platform
- **[Sui Foundation](https://sui.io)** - For Move language and tools
- **[Mysten Labs](https://mystenlabs.com)** - For excellent documentation
- **Premier League** - For inspiration (unofficial tribute)
- **Community** - For support and feedback

---

<div align="center">

## 🌟 Like Bet9ja Virtual? You'll Love VIRTUALZ!

### **May the odds be ever in your favor!** ⚽✨

Built with ❤️ on OneChain • Powered by Move • Secured by Blockchain

[🎮 Start Playing](#) • [📖 Read Docs](#) • [⭐ Star on GitHub](https://github.com/yourusername/virtualz)

</div>
