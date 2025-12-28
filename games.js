/* ==================== GAME CONFIGURATIONS & SCORING ==================== */

var gameConfigs = {
  rummy: {
    name: 'Rummy (Indian Paplu)',
    desc: '13-card game. Pure sequence required to win.',
    icon: '🃏',
    scores: [
      { label: 'Win', value: 0, desc: 'Declared with valid sets' },
      { label: 'Lose -20', value: -20, desc: 'Lost with few points' },
      { label: 'Lose -40', value: -40, desc: 'Lost with medium points' },
      { label: 'Lose -80', value: -80, desc: 'Full count / max penalty' }
    ],
    help: 'Winner gets 0 points. Losers get penalty based on unmatched cards. Max penalty: 80 points.'
  },
  
  teenpatti: {
    name: 'Teen Patti (3 Patti)',
    desc: '3-card poker. Betting game.',
    icon: '🎴',
    scores: [
      { label: 'Win Pot', value: 100, desc: 'Won the pot' },
      { label: 'Side Show Win', value: 50, desc: 'Won side show' },
      { label: 'Fold -10', value: -10, desc: 'Folded hand' },
      { label: 'Blind Bet', value: -5, desc: 'Blind bet lost' }
    ],
    help: 'Track pot wins and losses. Players bet into pot, winner takes all.'
  },
  
  andarbahar: {
    name: 'Andar Bahar',
    desc: 'Luck-based betting game.',
    icon: '🎲',
    scores: [
      { label: 'Win +50', value: 50, desc: 'Bet won' },
      { label: 'Lose -50', value: -50, desc: 'Bet lost' },
      { label: 'Win +25', value: 25, desc: 'Small bet won' },
      { label: 'Lose -25', value: -25, desc: 'Small bet lost' }
    ],
    help: 'Simple betting game. Andar or Bahar wins. Track your bets.'
  },
  
  poker: {
    name: 'Poker (Texas Hold\'em)',
    desc: 'Community cards. Best 5-card hand wins.',
    icon: '♠️',
    scores: [
      { label: 'Win Hand', value: 100, desc: 'Won the hand' },
      { label: 'Small Blind', value: -5, desc: 'Paid small blind' },
      { label: 'Big Blind', value: -10, desc: 'Paid big blind' },
      { label: 'Fold', value: 0, desc: 'Folded (no loss)' },
      { label: 'All-in Win', value: 200, desc: 'Won with all-in' }
    ],
    help: 'Track chips/points. Winner takes the pot. Blinds are mandatory bets.'
  },
  
  sattepesatta: {
    name: 'Satte Pe Satta (7 on 7)',
    desc: 'Sequence building from 7 of hearts.',
    icon: '7️⃣',
    scores: [
      { label: 'Win (1st)', value: 50, desc: 'Finished first' },
      { label: '2nd Place', value: 20, desc: 'Finished second' },
      { label: '3rd Place', value: 0, desc: 'Finished third' },
      { label: 'Last Place', value: -30, desc: 'Finished last' }
    ],
    help: 'First to empty hand wins. Play sequences from 7s. Track finishing positions.'
  },
  
  bluff: {
    name: 'Bluff (Challenge)',
    desc: 'Lie about your cards. Get caught or win.',
    icon: '🎭',
    scores: [
      { label: 'Win Round', value: 60, desc: 'Emptied hand first' },
      { label: 'Caught Bluffing', value: -20, desc: 'Bluff was called' },
      { label: 'Wrong Challenge', value: -10, desc: 'Challenged wrongly' },
      { label: 'Successful Bluff', value: 10, desc: 'Bluff not caught' }
    ],
    help: 'Declare cards face-down. Others can challenge. If caught lying, pick up pile.'
  },
  
  mendikot: {
    name: 'Mendikot (Mindi)',
    desc: 'Collect tens. Trick-taking game.',
    icon: '🔟',
    scores: [
      { label: 'Per Ten', value: 10, desc: 'Collected a ten' },
      { label: 'Last Trick', value: 5, desc: 'Won last trick' },
      { label: 'No Tens', value: -15, desc: 'Got no tens' },
      { label: 'All 4 Tens', value: 50, desc: 'Collected all tens' }
    ],
    help: 'Win tricks with tens. Team with 3+ tens wins. Last trick gives bonus points.'
  },
  
  teendopaanch: {
    name: 'Teen Do Paanch (3-2-5)',
    desc: '3 players. Make exact hands.',
    icon: '3️⃣2️⃣5️⃣',
    scores: [
      { label: 'Extra Hand +10', value: 10, desc: 'Won extra hand' },
      { label: 'Short Hand -10', value: -10, desc: 'Missed target hands' },
      { label: 'Exact Target', value: 0, desc: 'Made exact hands' },
      { label: 'Sweep +30', value: 30, desc: 'Won all hands' }
    ],
    help: '3 players: one gets 3 hands, one gets 2, one gets 5. Score by target completion.'
  },
  
  carrom: {
    name: 'Carrom',
    desc: 'Pocket pieces. Queen bonus.',
    icon: '⚫',
    scores: [
      { label: 'White', value: 1, desc: 'Pocketed white piece' },
      { label: 'Black', value: 2, desc: 'Pocketed black piece' },
      { label: 'Queen +5', value: 5, desc: 'Covered the queen' },
      { label: 'Foul -1', value: -1, desc: 'Committed foul' },
      { label: 'Board Win', value: 29, desc: 'Won the board' }
    ],
    help: 'Pocket your pieces. Cover queen by pocketing a piece after it. First to 29 points wins.'
  },
  
  ludo: {
    name: 'Ludo',
    desc: 'Race all tokens home.',
    icon: '🎲',
    scores: [
      { label: 'Win (1st)', value: 100, desc: 'Finished first' },
      { label: '2nd Place', value: 50, desc: 'Finished second' },
      { label: '3rd Place', value: 20, desc: 'Finished third' },
      { label: 'Last Place', value: 0, desc: 'Finished last' }
    ],
    help: 'Roll dice, move tokens. First to get all 4 tokens home wins. Track finishing positions.'
  }
};

/* ==================== HELPER: GET GAME LIST ==================== */
function getAllGames() {
  return Object.keys(gameConfigs);
}

function getGameConfig(gameKey) {
  return gameConfigs[gameKey] || null;
}

function getGameName(gameKey) {
  var cfg = gameConfigs[gameKey];
  return cfg ? cfg.name : gameKey;
}
