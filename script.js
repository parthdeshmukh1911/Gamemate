/* ==================== STATE ==================== */
var tambolaNumbers = Array.from({ length: 90 }, function(_, i) { return i + 1; });
var players = {};
var currentGame = 'rummy';

/* ==================== GAME CONFIGURATIONS ==================== */
var gameConfigs = {
  rummy: {
    name: 'Rummy (Indian Paplu)',
    desc: '13-card game. Pure sequence required.',
    scores: [
      { label: 'Win', value: 80 },
      { label: 'Lose', value: -20 },
      { label: 'Full Count', value: -80 }
    ]
  },
  teenpatti: {
    name: 'Teen Patti (3 Patti)',
    desc: '3-card poker. Betting game.',
    scores: [
      { label: 'Win Pot', value: 100 },
      { label: 'Side Show Win', value: 50 },
      { label: 'Fold', value: -10 }
    ]
  },
  andarbahar: {
    name: 'Andar Bahar',
    desc: 'Luck-based betting game.',
    scores: [
      { label: 'Win', value: 50 },
      { label: 'Lose', value: -50 }
    ]
  },
  poker: {
    name: 'Poker (Texas Hold\'em)',
    desc: 'Community cards. Best 5-card hand wins.',
    scores: [
      { label: 'Win Hand', value: 100 },
      { label: 'Small Blind', value: -5 },
      { label: 'Big Blind', value: -10 },
      { label: 'Fold', value: 0 }
    ]
  },
  sattepesatta: {
    name: 'Satte Pe Satta (7 on 7)',
    desc: 'Sequence building from 7 of hearts.',
    scores: [
      { label: 'Win (1st)', value: 50 },
      { label: '2nd Place', value: 20 },
      { label: 'Last Place', value: -30 }
    ]
  },
  bluff: {
    name: 'Bluff (Challenge)',
    desc: 'Lie about your cards. Get caught or win.',
    scores: [
      { label: 'Win', value: 60 },
      { label: 'Caught Bluffing', value: -20 },
      { label: 'Wrong Challenge', value: -10 }
    ]
  },
  mendikot: {
    name: 'Mendikot (Mindi)',
    desc: 'Collect tens. Trick-taking game.',
    scores: [
      { label: 'Per Ten', value: 10 },
      { label: 'Last Trick', value: 5 },
      { label: 'No Tens', value: -15 }
    ]
  },
  teendopaanch: {
    name: 'Teen Do Paanch (3-2-5)',
    desc: '3 players. Make exact hands.',
    scores: [
      { label: 'Extra Hand', value: 10 },
      { label: 'Short Hand', value: -10 },
      { label: 'Exact', value: 0 }
    ]
  },
  carrom: {
    name: 'Carrom',
    desc: 'Pocket pieces. Queen bonus.',
    scores: [
      { label: 'White Piece', value: 1 },
      { label: 'Black Piece', value: 2 },
      { label: 'Queen Cover', value: 5 },
      { label: 'Foul', value: -1 }
    ]
  },
  ludo: {
    name: 'Ludo',
    desc: 'Race all tokens home.',
    scores: [
      { label: 'Win (1st)', value: 100 },
      { label: '2nd Place', value: 50 },
      { label: '3rd Place', value: 20 },
      { label: 'Last', value: 0 }
    ]
  }
};

/* ==================== HELPERS ==================== */
function vibrate(pattern) {
  pattern = pattern || 40;
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

function pop(el) {
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

function setActiveNav(sectionId) {
  var btns = document.querySelectorAll(".nav-btn");
  btns.forEach(function(btn) {
    if (btn.getAttribute("data-section") === sectionId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==================== NAVIGATION ==================== */
function showSection(id) {
  var sections = document.querySelectorAll(".section");
  sections.forEach(function(sec) {
    sec.classList.remove("active");
  });
  
  var active = document.getElementById(id);
  if (active) {
    active.classList.add("active");
  }
  
  setActiveNav(id);
  vibrate(20);
}

/* ==================== DICE ROLLER ==================== */
function rollDice() {
  var sidesInput = document.getElementById("diceSides");
  var countInput = document.getElementById("diceCount");
  var diceDisplay = document.getElementById("diceDisplay");
  var diceResult = document.getElementById("diceResult");
  
  var sides = Number(sidesInput.value) || 6;
  var count = Number(countInput.value) || 1;

  if (sides < 2) {
    diceResult.textContent = "⚠️ Enter valid sides (min 2)";
    vibrate(200);
    return;
  }
  if (count < 1 || count > 10) {
    diceResult.textContent = "⚠️ Dice count: 1 to 10";
    vibrate(200);
    return;
  }

  vibrate(60);
  diceResult.textContent = "🎲 Rolling...";
  pop(diceResult);

  diceDisplay.innerHTML = "";
  var diceEls = [];
  
  for (var i = 0; i < count; i++) {
    var d = document.createElement("div");
    d.className = "simple-dice rolling";
    d.innerHTML = sides === 6 ? '<div class="dice-dots"></div>' : '<div class="dice-number">?</div>';
    diceDisplay.appendChild(d);
    diceEls.push(d);
  }

  setTimeout(function() {
    var results = [];
    
    for (var i = 0; i < count; i++) {
      var value = Math.floor(Math.random() * sides) + 1;
      results.push(value);

      var d = diceEls[i];
      d.classList.remove("rolling");

      if (sides === 6) {
        d.innerHTML = createDiceFace(value);
      } else {
        d.innerHTML = '<div class="dice-number">' + value + '</div>';
      }
    }

    var total = results.reduce(function(a, b) { return a + b; }, 0);
    var resultText;
    
    if (count === 1) {
      resultText = "Result: <strong>" + results[0] + "</strong>";
    } else if (count <= 5) {
      resultText = "<strong>" + results.join(" + ") + " = " + total + "</strong>";
    } else {
      resultText = "Total: <strong>" + total + "</strong> (" + results.join(", ") + ")";
    }
    
    diceResult.innerHTML = resultText;
    pop(diceResult);
    vibrate([30, 50, 30]);
  }, 560);
}

function createDiceFace(number) {
  var dotsCount = Math.min(Math.max(number, 1), 6);
  var dots = "";
  for (var i = 0; i < dotsCount; i++) {
    dots += '<div class="dot"></div>';
  }
  return '<div class="dice-dots dice-face-' + dotsCount + '">' + dots + '</div>';
}

/* ==================== TAMBOLA NUMBER PICKER ==================== */
function pickTambola() {
  var tambolaNumber = document.getElementById("tambolaNumber");
  var tambolaHistory = document.getElementById("tambolaHistory");

  if (tambolaNumbers.length === 0) {
    tambolaNumber.textContent = "🎉 Complete!";
    pop(tambolaNumber);
    vibrate([80, 50, 80]);
    return;
  }

  vibrate(50);

  var index = Math.floor(Math.random() * tambolaNumbers.length);
  var num = tambolaNumbers.splice(index, 1)[0];

  tambolaNumber.textContent = num;
  pop(tambolaNumber);

  var chip = document.createElement("span");
  chip.textContent = num;
  tambolaHistory.appendChild(chip);
}

function resetTambola() {
  tambolaNumbers = Array.from({ length: 90 }, function(_, i) { return i + 1; });
  document.getElementById("tambolaNumber").textContent = "---";
  document.getElementById("tambolaHistory").innerHTML = "";
  vibrate(30);
}

/* ==================== COIN TOSS ==================== */
function coinToss() {
  var coin = document.getElementById("coin3d");
  var coinResult = document.getElementById("coinResult");

  var isHeads = Math.random() < 0.5;
  
  coinResult.textContent = "🪙 Flipping...";
  pop(coinResult);
  vibrate(60);

  coin.classList.remove("flipping");
  void coin.offsetWidth;
  coin.classList.add("flipping");

  var finalRotation = isHeads ? 1440 : 1620;
  
  setTimeout(function() {
    coin.style.transform = "rotateY(" + finalRotation + "deg)";
    coinResult.innerHTML = isHeads ? "<strong>🪙 HEADS</strong>" : "<strong>🪙 TAILS</strong>";
    pop(coinResult);
    vibrate([30, 70, 30]);
  }, 950);
}

/* ==================== DECISION MAKER ==================== */
function makeDecision() {
  var optionsEl = document.getElementById("options");
  var decisionResult = document.getElementById("decisionResult");

  var opts = optionsEl.value
    .split(",")
    .map(function(o) { return o.trim(); })
    .filter(function(o) { return o.length > 0; });

  if (opts.length === 0) {
    decisionResult.textContent = "⚠️ Enter options (comma-separated)";
    pop(decisionResult);
    vibrate(100);
    return;
  }

  if (opts.length === 1) {
    decisionResult.textContent = "⚠️ Need at least 2 options";
    pop(decisionResult);
    vibrate(100);
    return;
  }

  vibrate(40);

  var pick = opts[Math.floor(Math.random() * opts.length)];
  decisionResult.innerHTML = "<strong>🎯 " + escapeHtml(pick) + "</strong>";
  pop(decisionResult);
  vibrate([40, 60, 40]);
}

/* ==================== GAME SCOREBOARD ==================== */
function changeGame() {
  var select = document.getElementById("gameSelect");
  currentGame = select.value;
  
  var config = gameConfigs[currentGame];
  var infoDiv = document.getElementById("gameInfo");
  
  if (infoDiv && config) {
    infoDiv.innerHTML = "<strong>" + config.name + "</strong> " + config.desc;
  }
  
  renderPlayers();
  vibrate(30);
}

function addPlayer() {
  var input = document.getElementById("playerName");
  var name = input.value.trim();
  
  if (!name) {
    vibrate(100);
    return;
  }

  if (players[name] === undefined) {
    players[name] = 0;
  } else {
    vibrate(100);
    return;
  }
  
  input.value = "";
  renderPlayers();
  vibrate(30);
}

function updateScore(name, delta) {
  if (players[name] !== undefined) {
    players[name] = players[name] + delta;
    renderPlayers();
    vibrate(20);
  }
}

function removePlayer(name) {
  delete players[name];
  renderPlayers();
  vibrate(40);
}

function resetGame() {
  if (Object.keys(players).length === 0) {
    vibrate(100);
    return;
  }
  
  if (confirm("Reset all player scores for this game?")) {
    players = {};
    renderPlayers();
    vibrate(50);
  }
}

function renderPlayers() {
  var playersDiv = document.getElementById("players");
  if (!playersDiv) return;
  
  playersDiv.innerHTML = "";

  var names = Object.keys(players);
  
  if (names.length === 0) {
    var empty = document.createElement("div");
    empty.style.color = "var(--muted)";
    empty.style.padding = "16px 12px";
    empty.style.textAlign = "center";
    empty.style.fontSize = "0.9rem";
    empty.textContent = "No players yet. Add players above to start scoring.";
    playersDiv.appendChild(empty);
    return;
  }

  var config = gameConfigs[currentGame];
  if (!config) return;

  names.forEach(function(name) {
    var row = document.createElement("div");
    row.className = "player-row";

    var leftDiv = document.createElement("div");
    
    var nameDiv = document.createElement("div");
    nameDiv.className = "player-name";
    nameDiv.textContent = name;
    
    var scoreDiv = document.createElement("div");
    scoreDiv.className = "player-score";
    scoreDiv.textContent = players[name];
    
    leftDiv.appendChild(nameDiv);
    leftDiv.appendChild(scoreDiv);

    var actionsDiv = document.createElement("div");
    actionsDiv.className = "score-actions";

    config.scores.forEach(function(scoreOption) {
      var btn = document.createElement("button");
      btn.className = "small-btn";
      
      if (scoreOption.value > 0) {
        btn.classList.add("positive");
      } else if (scoreOption.value < 0) {
        btn.classList.add("negative");
      }
      
      var displayLabel = scoreOption.label;
      if (scoreOption.value > 0) {
        displayLabel = "+" + scoreOption.value;
      } else if (scoreOption.value < 0) {
        displayLabel = scoreOption.value;
      } else {
        displayLabel = scoreOption.label;
      }
      
      btn.textContent = displayLabel;
      btn.title = scoreOption.label;
      btn.onclick = (function(n, val) {
        return function() {
          updateScore(n, val);
        };
      })(name, scoreOption.value);
      
      actionsDiv.appendChild(btn);
    });

    var btnDel = document.createElement("button");
    btnDel.className = "small-btn";
    btnDel.textContent = "×";
    btnDel.title = "Remove player";
    btnDel.style.fontSize = "1.2rem";
    btnDel.onclick = (function(n) {
      return function() {
        removePlayer(n);
      };
    })(name);
    
    actionsDiv.appendChild(btnDel);

    row.appendChild(leftDiv);
    row.appendChild(actionsDiv);

    playersDiv.appendChild(row);
  });
}

/* ==================== INITIALIZATION ==================== */
window.addEventListener("DOMContentLoaded", function() {
  setActiveNav("dice");
  
  var diceDisplay = document.getElementById("diceDisplay");
  if (diceDisplay) {
    diceDisplay.innerHTML = '<div class="simple-dice">' + createDiceFace(1) + '</div>';
  }
  
  var gameSelect = document.getElementById("gameSelect");
  if (gameSelect) {
    changeGame();
  }
  
  renderPlayers();
});
