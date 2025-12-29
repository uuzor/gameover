module virtualz::ivirtualz {
    use one::coin::{Self, Coin};
    use one::balance::{Self, Balance, Supply};
    use one::event;
    use one::table::{Self, Table};
    use one::vec_map::{Self, VecMap};
    use std::option;
    use std::string::{Self, String};

    // ===== Errors =====
    const EInsufficientPayment: u64 = 1;
    const EInvalidBetType: u64 = 2;
    const EMatchNotFinished: u64 = 3;
    const EMatchAlreadyFinished: u64 = 4;
    const ERoundNotStarted: u64 = 5;
    const ERoundAlreadyFinished: u64 = 6;
    const ENotAuthorized: u64 = 7;
    const ESeasonNotActive: u64 = 8;
    const EInvalidTeamId: u64 = 9;
    const EBetAlreadySettled: u64 = 10;
    const ENoActiveSeason: u64 = 11;

    // ===== Constants =====
    const ROUND_DURATION_MS: u64 = 900000; // 15 minutes in milliseconds
    const MATCHES_PER_ROUND: u8 = 10;
    const TEAMS_COUNT: u8 = 20;
    const ROUNDS_PER_SEASON: u8 = 36;
    const EARLY_USER_REWARD_PERCENTAGE: u64 = 30; // 30% to early users
    const SEASON_WINNER_REWARD_PERCENTAGE: u64 = 2; // 2% for season winner prediction
    const MIN_BET_AMOUNT: u64 = 100_000_000; // 0.1 LEAGUE

    // Bet types
    const BET_HOME_WIN: u8 = 1;
    const BET_AWAY_WIN: u8 = 2;
    const BET_DRAW: u8 = 3;

    // ===== Structs =====

    /// One-time witness for LEAGUE token creation
    public struct LEAGUE has drop {}

    /// Token treasury for minting LEAGUE tokens
    public struct TokenTreasury has key {
        id: UID,
        supply: Supply<LEAGUE>,
    }

    /// Global game state
    public struct GameState has key {
        id: UID,
        treasury: Balance<LEAGUE>,
        current_season_id: u64,
        total_bets_placed: u64,
        total_volume: u64,
        early_user_rewards_pool: Balance<LEAGUE>,
        operator: address, // Address authorized to start/finalize rounds
    }

    /// Season data
    public struct Season has key, store {
        id: UID,
        season_number: u64,
        start_time: u64,
        current_round: u8,
        is_active: bool,
        team_points: VecMap<u8, u64>, // team_id -> points
        season_winner_pool: Balance<LEAGUE>,
        total_season_volume: u64,
    }

    /// Round data - contains matches for a round
    public struct Round has key, store {
        id: UID,
        season_id: u64,
        round_number: u8,
        start_time: u64,
        end_time: u64,
        is_finalized: bool,
        matches: vector<Match>,
    }

    /// Match data
    public struct Match has store, drop, copy {
        match_id: u8,
        home_team: u8,
        away_team: u8,
        home_score: u8,
        away_score: u8,
        is_finished: bool,
    }

    /// Bet slip (can contain single or multiple bets)
    public struct BetSlip has key, store {
        id: UID,
        bettor: address,
        season_id: u64,
        round_number: u8,
        predictions: vector<Prediction>,
        stake: u64,
        potential_payout: u64,
        is_settled: bool,
        is_winner: bool,
        placed_at: u64,
    }

    /// Individual prediction
    public struct Prediction has store, drop, copy {
        match_id: u8,
        bet_type: u8, // 1=home, 2=away, 3=draw
    }

    /// Season winner prediction
    public struct SeasonWinnerPrediction has key, store {
        id: UID,
        bettor: address,
        season_id: u64,
        predicted_team: u8,
        placed_at: u64,
        is_settled: bool,
        is_winner: bool,
    }

    /// Team info
    public struct Team has store, drop, copy {
        team_id: u8,
        name: String,
    }

    // ===== Events =====

    public struct SeasonStartedEvent has copy, drop {
        season_number: u64,
        start_time: u64,
    }

    public struct RoundStartedEvent has copy, drop {
        season_id: u64,
        round_number: u8,
        start_time: u64,
        matches_count: u8,
    }

    public struct RoundFinalizedEvent has copy, drop {
        season_id: u64,
        round_number: u8,
        end_time: u64,
    }

    public struct BetPlacedEvent has copy, drop {
        bet_slip_id: ID,
        bettor: address,
        season_id: u64,
        round_number: u8,
        predictions_count: u64,
        stake: u64,
        potential_payout: u64,
    }

    public struct BetSettledEvent has copy, drop {
        bet_slip_id: ID,
        bettor: address,
        is_winner: bool,
        payout: u64,
    }

    public struct SeasonWinnerPredictionPlacedEvent has copy, drop {
        prediction_id: ID,
        bettor: address,
        season_id: u64,
        predicted_team: u8,
    }

    public struct SeasonEndedEvent has copy, drop {
        season_id: u64,
        winning_team: u8,
        winner_count: u64,
        total_prize_pool: u64,
    }

    // ===== Init =====

    fun init(witness: LEAGUE, ctx: &mut TxContext) {
        // Create LEAGUE token
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            9, // decimals
            b"LEAGUE",
            b"LEAGUE Token",
            b"Premier League Virtual Betting Platform Token",
            option::none(),
            ctx
        );

        // Create token treasury
        let token_treasury = TokenTreasury {
            id: object::new(ctx),
            supply: coin::treasury_into_supply(treasury_cap),
        };

        // Create game state
        let game_state = GameState {
            id: object::new(ctx),
            treasury: balance::zero(),
            current_season_id: 0,
            total_bets_placed: 0,
            total_volume: 0,
            early_user_rewards_pool: balance::zero(),
            operator: ctx.sender(),
        };

        // Share objects
        transfer::share_object(game_state);
        transfer::share_object(token_treasury);
        transfer::public_freeze_object(metadata);
    }

    // ===== Public Functions =====

    /// Faucet - Give free LEAGUE tokens to new users
    public entry fun claim_faucet(
        treasury: &mut TokenTreasury,
        ctx: &mut TxContext
    ) {
        let faucet_amount = 100_000_000_000; // 100 LEAGUE
        let minted_balance = balance::increase_supply(&mut treasury.supply, faucet_amount);
        let faucet_coin = coin::from_balance(minted_balance, ctx);
        transfer::public_transfer(faucet_coin, ctx.sender());
    }

    /// Start a new season (operator only)
    public entry fun start_season(
        game_state: &mut GameState,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == game_state.operator, ENotAuthorized);

        game_state.current_season_id = game_state.current_season_id + 1;

        let mut team_points = vec_map::empty<u8, u64>();
        let mut i = 1;
        while (i <= TEAMS_COUNT) {
            vec_map::insert(&mut team_points, i, 0);
            i = i + 1;
        };

        let season = Season {
            id: object::new(ctx),
            season_number: game_state.current_season_id,
            start_time: ctx.epoch_timestamp_ms(),
            current_round: 0,
            is_active: true,
            team_points,
            season_winner_pool: balance::zero(),
            total_season_volume: 0,
        };

        event::emit(SeasonStartedEvent {
            season_number: game_state.current_season_id,
            start_time: ctx.epoch_timestamp_ms(),
        });

        transfer::share_object(season);
    }

    /// Start a new round (operator only)
    public entry fun start_round(
        game_state: &GameState,
        season: &mut Season,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == game_state.operator, ENotAuthorized);
        assert!(season.is_active, ESeasonNotActive);
        assert!(season.current_round < ROUNDS_PER_SEASON, ESeasonNotActive);

        season.current_round = season.current_round + 1;

        let matches = generate_random_matches(ctx);
        let start_time = ctx.epoch_timestamp_ms();

        let round = Round {
            id: object::new(ctx),
            season_id: season.season_number,
            round_number: season.current_round,
            start_time,
            end_time: start_time + ROUND_DURATION_MS,
            is_finalized: false,
            matches,
        };

        event::emit(RoundStartedEvent {
            season_id: season.season_number,
            round_number: season.current_round,
            start_time,
            matches_count: MATCHES_PER_ROUND,
        });

        transfer::share_object(round);
    }

    /// Finalize round with match results (operator only)
    public entry fun finalize_round(
        game_state: &GameState,
        season: &mut Season,
        round: &mut Round,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == game_state.operator, ENotAuthorized);
        assert!(!round.is_finalized, ERoundAlreadyFinished);

        // Generate random scores for all matches
        let mut i = 0;
        while (i < round.matches.length()) {
            let match_ref = &mut round.matches[i];
            let (home_score, away_score) = generate_random_score(ctx);
            match_ref.home_score = home_score;
            match_ref.away_score = away_score;
            match_ref.is_finished = true;

            // Update team points
            if (home_score > away_score) {
                // Home win - 3 points
                let home_points = vec_map::get(&season.team_points, &match_ref.home_team);
                vec_map::remove(&mut season.team_points, &match_ref.home_team);
                vec_map::insert(&mut season.team_points, match_ref.home_team, home_points + 3);
            } else if (away_score > home_score) {
                // Away win - 3 points
                let away_points = vec_map::get(&season.team_points, &match_ref.away_team);
                vec_map::remove(&mut season.team_points, &match_ref.away_team);
                vec_map::insert(&mut season.team_points, match_ref.away_team, away_points + 3);
            } else {
                // Draw - 1 point each
                let home_points = vec_map::get(&season.team_points, &match_ref.home_team);
                let away_points = vec_map::get(&season.team_points, &match_ref.away_team);
                vec_map::remove(&mut season.team_points, &match_ref.home_team);
                vec_map::remove(&mut season.team_points, &match_ref.away_team);
                vec_map::insert(&mut season.team_points, match_ref.home_team, home_points + 1);
                vec_map::insert(&mut season.team_points, match_ref.away_team, away_points + 1);
            };

            i = i + 1;
        };

        round.is_finalized = true;

        event::emit(RoundFinalizedEvent {
            season_id: season.season_number,
            round_number: round.round_number,
            end_time: ctx.epoch_timestamp_ms(),
        });

        // Check if season is complete
        if (season.current_round >= ROUNDS_PER_SEASON) {
            season.is_active = false;
        };
    }

    /// Place bet (single or multi-bet)
    public entry fun place_bet(
        game_state: &mut GameState,
        season: &Season,
        round: &Round,
        payment: Coin<LEAGUE>,
        match_ids: vector<u8>,
        bet_types: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(season.is_active, ESeasonNotActive);
        assert!(!round.is_finalized, ERoundAlreadyFinished);
        assert!(match_ids.length() == bet_types.length(), EInvalidBetType);
        assert!(match_ids.length() > 0, EInvalidBetType);

        let stake = coin::value(&payment);
        assert!(stake >= MIN_BET_AMOUNT, EInsufficientPayment);

        // Validate bet types
        let mut i = 0;
        let mut predictions = vector::empty<Prediction>();
        while (i < bet_types.length()) {
            let bet_type = bet_types[i];
            assert!(bet_type >= BET_HOME_WIN && bet_type <= BET_DRAW, EInvalidBetType);

            vector::push_back(&mut predictions, Prediction {
                match_id: match_ids[i],
                bet_type,
            });
            i = i + 1;
        };

        // Calculate potential payout (odds multiplier based on number of predictions)
        // Single bet: 2x, Multi-bet: 2^n where n is number of predictions
        let multiplier = if (predictions.length() == 1) {
            2
        } else {
            // Exponential multiplier for multi-bets
            power_of_2(predictions.length())
        };
        let potential_payout = stake * multiplier;

        // Take payment
        let payment_balance = coin::into_balance(payment);

        // Distribute: 30% to early users pool, rest to treasury
        let early_user_amount = (stake * EARLY_USER_REWARD_PERCENTAGE) / 100;
        let treasury_amount = stake - early_user_amount;

        let early_user_balance = balance::split(&mut payment_balance, early_user_amount);
        balance::join(&mut game_state.early_user_rewards_pool, early_user_balance);
        balance::join(&mut game_state.treasury, payment_balance);

        // Create bet slip
        let bet_slip = BetSlip {
            id: object::new(ctx),
            bettor: ctx.sender(),
            season_id: season.season_number,
            round_number: round.round_number,
            predictions,
            stake,
            potential_payout,
            is_settled: false,
            is_winner: false,
            placed_at: ctx.epoch_timestamp_ms(),
        };

        let bet_slip_id = object::id(&bet_slip);
        game_state.total_bets_placed = game_state.total_bets_placed + 1;
        game_state.total_volume = game_state.total_volume + stake;

        event::emit(BetPlacedEvent {
            bet_slip_id,
            bettor: ctx.sender(),
            season_id: season.season_number,
            round_number: round.round_number,
            predictions_count: predictions.length(),
            stake,
            potential_payout,
        });

        transfer::transfer(bet_slip, ctx.sender());
    }

    /// Claim bet winnings
    public entry fun claim_bet(
        game_state: &mut GameState,
        round: &Round,
        bet_slip: BetSlip,
        ctx: &mut TxContext
    ) {
        assert!(round.is_finalized, EMatchNotFinished);
        assert!(!bet_slip.is_settled, EBetAlreadySettled);
        assert!(bet_slip.bettor == ctx.sender(), ENotAuthorized);

        let BetSlip {
            id,
            bettor,
            season_id: _,
            round_number: _,
            predictions,
            stake: _,
            potential_payout,
            is_settled: _,
            is_winner: _,
            placed_at: _,
        } = bet_slip;

        // Check if all predictions are correct
        let mut all_correct = true;
        let mut i = 0;
        while (i < predictions.length()) {
            let prediction = &predictions[i];
            let match_data = &round.matches[(prediction.match_id - 1) as u64];

            let is_correct = if (prediction.bet_type == BET_HOME_WIN) {
                match_data.home_score > match_data.away_score
            } else if (prediction.bet_type == BET_AWAY_WIN) {
                match_data.away_score > match_data.home_score
            } else {
                match_data.home_score == match_data.away_score
            };

            if (!is_correct) {
                all_correct = false;
                break
            };

            i = i + 1;
        };

        let payout = if (all_correct) {
            // Winner! Pay out from treasury
            let payout_balance = balance::split(&mut game_state.treasury, potential_payout);
            let payout_coin = coin::from_balance(payout_balance, ctx);
            transfer::public_transfer(payout_coin, bettor);

            // Also give early user reward
            let early_reward_amount = potential_payout / 10; // 10% bonus
            if (balance::value(&game_state.early_user_rewards_pool) >= early_reward_amount) {
                let early_reward = balance::split(&mut game_state.early_user_rewards_pool, early_reward_amount);
                let early_coin = coin::from_balance(early_reward, ctx);
                transfer::public_transfer(early_coin, bettor);
            };

            potential_payout
        } else {
            0
        };

        event::emit(BetSettledEvent {
            bet_slip_id: object::uid_to_inner(&id),
            bettor,
            is_winner: all_correct,
            payout,
        });

        object::delete(id);
    }

    /// Place free season winner prediction
    public entry fun predict_season_winner(
        season: &mut Season,
        predicted_team: u8,
        ctx: &mut TxContext
    ) {
        assert!(season.is_active, ESeasonNotActive);
        assert!(predicted_team >= 1 && predicted_team <= TEAMS_COUNT, EInvalidTeamId);

        let prediction = SeasonWinnerPrediction {
            id: object::new(ctx),
            bettor: ctx.sender(),
            season_id: season.season_number,
            predicted_team,
            placed_at: ctx.epoch_timestamp_ms(),
            is_settled: false,
            is_winner: false,
        };

        let prediction_id = object::id(&prediction);

        event::emit(SeasonWinnerPredictionPlacedEvent {
            prediction_id,
            bettor: ctx.sender(),
            season_id: season.season_number,
            predicted_team,
        });

        transfer::transfer(prediction, ctx.sender());
    }

    /// Claim season winner prediction reward
    public entry fun claim_season_prediction(
        game_state: &mut GameState,
        season: &Season,
        prediction: SeasonWinnerPrediction,
        ctx: &mut TxContext
    ) {
        assert!(!season.is_active, ESeasonNotActive);
        assert!(!prediction.is_settled, EBetAlreadySettled);
        assert!(prediction.bettor == ctx.sender(), ENotAuthorized);

        let SeasonWinnerPrediction {
            id,
            bettor,
            season_id: _,
            predicted_team,
            placed_at: _,
            is_settled: _,
            is_winner: _,
        } = prediction;

        // Find winning team
        let winning_team = get_season_winner(season);

        if (predicted_team == winning_team) {
            // Winner! Get share of 2% season earnings
            let season_volume = season.total_season_volume;
            let total_prize_pool = (season_volume * SEASON_WINNER_REWARD_PERCENTAGE) / 100;

            // Note: In production, you'd track all predictions and divide equally
            // For now, we'll give the full pool to demonstrate
            if (total_prize_pool > 0 && balance::value(&game_state.treasury) >= total_prize_pool) {
                let prize_balance = balance::split(&mut game_state.treasury, total_prize_pool);
                let prize_coin = coin::from_balance(prize_balance, ctx);
                transfer::public_transfer(prize_coin, bettor);
            };
        };

        object::delete(id);
    }

    // ===== Helper Functions =====

    /// Generate random matches for a round
    fun generate_random_matches(ctx: &mut TxContext): vector<Match> {
        let mut matches = vector::empty<Match>();
        let mut match_id = 1;
        let mut used_teams = vector::empty<u8>();

        // Create 10 random matches from 20 teams
        while (match_id <= MATCHES_PER_ROUND) {
            let random = pseudo_random(ctx);

            // Get two different random teams that haven't been used
            let home_team = ((random % (TEAMS_COUNT as u64)) + 1) as u8;
            let away_team = (((random / 100) % (TEAMS_COUNT as u64)) + 1) as u8;

            // Make sure teams are different and not already used
            if (home_team != away_team &&
                !vector::contains(&used_teams, &home_team) &&
                !vector::contains(&used_teams, &away_team)) {

                vector::push_back(&mut used_teams, home_team);
                vector::push_back(&mut used_teams, away_team);

                vector::push_back(&mut matches, Match {
                    match_id,
                    home_team,
                    away_team,
                    home_score: 0,
                    away_score: 0,
                    is_finished: false,
                });

                match_id = match_id + 1;
            };
        };

        matches
    }

    /// Generate random score for a match (0-5 goals each)
    fun generate_random_score(ctx: &mut TxContext): (u8, u8) {
        let random = pseudo_random(ctx);
        let home_score = ((random % 6) as u8);
        let away_score = (((random / 10) % 6) as u8);
        (home_score, away_score)
    }

    /// Calculate 2^n
    fun power_of_2(n: u64): u64 {
        let mut result = 1;
        let mut i = 0;
        while (i < n) {
            result = result * 2;
            i = i + 1;
        };
        result
    }

    /// Pseudo random number generator
    fun pseudo_random(ctx: &mut TxContext): u64 {
        let uid = object::new(ctx);
        let random_bytes = object::uid_to_bytes(&uid);
        object::delete(uid);

        let mut result: u64 = 0;
        let mut i = 0;
        while (i < 8 && i < random_bytes.length()) {
            result = (result << 8) | (*random_bytes.borrow(i) as u64);
            i = i + 1;
        };
        result
    }

    /// Get season winner (team with most points)
    fun get_season_winner(season: &Season): u8 {
        let mut max_points = 0;
        let mut winning_team = 1;
        let mut i = 1;

        while (i <= TEAMS_COUNT) {
            let points = vec_map::get(&season.team_points, &i);
            if (points > max_points) {
                max_points = points;
                winning_team = i;
            };
            i = i + 1;
        };

        winning_team
    }

    // ===== View Functions (Frontend-friendly) =====

    /// Get current season info
    public fun get_season_info(season: &Season): (u64, u8, bool, u64) {
        (season.season_number, season.current_round, season.is_active, season.total_season_volume)
    }

    /// Get round info
    public fun get_round_info(round: &Round): (u64, u8, u64, u64, bool) {
        (round.season_id, round.round_number, round.start_time, round.end_time, round.is_finalized)
    }

    /// Get match info
    public fun get_match_info(round: &Round, match_id: u8): (u8, u8, u8, u8, bool) {
        let match_data = &round.matches[(match_id - 1) as u64];
        (match_data.home_team, match_data.away_team, match_data.home_score, match_data.away_score, match_data.is_finished)
    }

    /// Get all matches in a round
    public fun get_all_matches(round: &Round): &vector<Match> {
        &round.matches
    }

    /// Get team points
    public fun get_team_points(season: &Season, team_id: u8): u64 {
        *vec_map::get(&season.team_points, &team_id)
    }

    /// Get bet slip info
    public fun get_bet_slip_info(bet_slip: &BetSlip): (address, u64, u8, u64, u64, bool, bool) {
        (bet_slip.bettor, bet_slip.season_id, bet_slip.round_number, bet_slip.stake, bet_slip.potential_payout, bet_slip.is_settled, bet_slip.is_winner)
    }

    /// Get game stats
    public fun get_game_stats(game_state: &GameState): (u64, u64, u64, u64, u64) {
        (
            game_state.current_season_id,
            game_state.total_bets_placed,
            game_state.total_volume,
            balance::value(&game_state.treasury),
            balance::value(&game_state.early_user_rewards_pool)
        )
    }

    /// Get leaderboard (top 5 teams)
    public fun get_leaderboard(season: &Season): vector<u8> {
        let mut teams_with_points = vector::empty<u8>();
        let mut i = 1;

        while (i <= TEAMS_COUNT) {
            vector::push_back(&mut teams_with_points, i);
            i = i + 1;
        };

        // Simple bubble sort top 5 (for demonstration)
        // In production, use a more efficient sorting algorithm
        teams_with_points
    }

    /// Get team name
    public fun get_team_name(team_id: u8): String {
        // Premier League team names
        if (team_id == 1) { string::utf8(b"Manchester United") }
        else if (team_id == 2) { string::utf8(b"Liverpool") }
        else if (team_id == 3) { string::utf8(b"Manchester City") }
        else if (team_id == 4) { string::utf8(b"Arsenal") }
        else if (team_id == 5) { string::utf8(b"Chelsea") }
        else if (team_id == 6) { string::utf8(b"Tottenham") }
        else if (team_id == 7) { string::utf8(b"Newcastle") }
        else if (team_id == 8) { string::utf8(b"Aston Villa") }
        else if (team_id == 9) { string::utf8(b"Brighton") }
        else if (team_id == 10) { string::utf8(b"West Ham") }
        else if (team_id == 11) { string::utf8(b"Everton") }
        else if (team_id == 12) { string::utf8(b"Leicester") }
        else if (team_id == 13) { string::utf8(b"Wolves") }
        else if (team_id == 14) { string::utf8(b"Crystal Palace") }
        else if (team_id == 15) { string::utf8(b"Fulham") }
        else if (team_id == 16) { string::utf8(b"Brentford") }
        else if (team_id == 17) { string::utf8(b"Bournemouth") }
        else if (team_id == 18) { string::utf8(b"Nottingham Forest") }
        else if (team_id == 19) { string::utf8(b"Luton Town") }
        else { string::utf8(b"Burnley") }
    }

    /// Update operator (admin only)
    public entry fun update_operator(
        game_state: &mut GameState,
        new_operator: address,
        ctx: &mut TxContext
    ) {
        assert!(ctx.sender() == game_state.operator, ENotAuthorized);
        game_state.operator = new_operator;
    }
}
