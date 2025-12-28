/* ==================== STATE ==================== */
var tambolaNumbers = Array.from({ length: 90 }, function(_, i) { return i + 1; });

/* ==================== SCOREBOARD: PER-GAME STATE ==================== */
var STORAGE_KEY = "ogt_scoreboards_v1";
var scoreboards = loadScoreboards();
var currentGame = "rummy";

function loadScoreboards() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    var parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

function saveScoreboards() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scoreboards));
  } catch (e) {}
}

function ensureGameBoard(gameKey) {
  if (!scoreboards[gameKey]) scoreboards[gameKey] = { players: {} };
  if (!scoreboards[gameKey].players) scoreboards[gameKey].players = {};
}

function currentPlayers() {
  ensureGameBoard(currentGame);
  return scoreboards[currentGame].players;
}

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

/* ==================== TAMBOLA ==================== */
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
  currentGame = select ? select.value : "rummy";

  ensureGameBoard(currentGame);
  saveScoreboards();

  var infoDiv = document.getElementById("gameInfo");
  var cfg = getGameConfig(currentGame);
  
  if (infoDiv && cfg) {
    infoDiv.innerHTML = "<strong>" + cfg.name + "</strong> " + cfg.desc;
  }

  renderPlayers();
  vibrate(20);
}

function addPlayer() {
  var input = document.getElementById("playerName");
  var name = input ? input.value.trim() : "";
  if (!name) { vibrate(80); return; }

  var p = currentPlayers();

  if (p[name] !== undefined) {
    vibrate(120);
    return;
  }

  p[name] = 0;
  if (input) input.value = "";
  saveScoreboards();
  renderPlayers();
  vibrate(30);
}

function updateScore(name, delta) {
  var p = currentPlayers();
  if (p[name] === undefined) return;

  p[name] = Number(p[name] || 0) + Number(delta || 0);
  saveScoreboards();
  renderPlayers();
  vibrate(15);
}

function removePlayer(name) {
  var p = currentPlayers();
  if (p[name] === undefined) return;

  delete p[name];
  saveScoreboards();
  renderPlayers();
  vibrate(30);
}

function resetGame() {
  ensureGameBoard(currentGame);

  var p = currentPlayers();
  var hasPlayers = Object.keys(p).length > 0;
  if (!hasPlayers) { vibrate(80); return; }

  var gameName = getGameName(currentGame);
  if (confirm("Reset scores for " + gameName + "?")) {
    scoreboards[currentGame].players = {};
    saveScoreboards();
    renderPlayers();
    vibrate(50);
  }
}

function renderPlayers() {
  var playersDiv = document.getElementById("players");
  if (!playersDiv) return;

  playersDiv.innerHTML = "";

  var p = currentPlayers();
  var names = Object.keys(p);

  if (names.length === 0) {
    var empty = document.createElement("div");
    empty.style.color = "var(--muted)";
    empty.style.padding = "16px 12px";
    empty.style.textAlign = "center";
    empty.style.fontSize = "0.9rem";
    empty.textContent = "No players for this game. Add players above.";
    playersDiv.appendChild(empty);
    return;
  }

  var cfg = getGameConfig(currentGame);

  names.sort(function(a, b) {
    var sa = Number(p[a] || 0);
    var sb = Number(p[b] || 0);
    if (sb !== sa) return sb - sa;
    return a.localeCompare(b);
  });

  names.forEach(function(name) {
    var row = document.createElement("div");
    row.className = "player-row";

    var leftDiv = document.createElement("div");

    var nameDiv = document.createElement("div");
    nameDiv.className = "player-name";
    nameDiv.textContent = name;

    var scoreDiv = document.createElement("div");
    scoreDiv.className = "player-score";
    scoreDiv.textContent = p[name];

    leftDiv.appendChild(nameDiv);
    leftDiv.appendChild(scoreDiv);

    var actionsDiv = document.createElement("div");
    actionsDiv.className = "score-actions";

    if (cfg && cfg.scores && cfg.scores.length) {
      cfg.scores.forEach(function(opt) {
        var btn = document.createElement("button");
        btn.className = "small-btn";

        if (opt.value > 0) btn.classList.add("positive");
        if (opt.value < 0) btn.classList.add("negative");

        var label = (opt.value > 0) ? ("+" + opt.value) : (opt.value < 0 ? String(opt.value) : opt.label);
        btn.textContent = label;
        btn.title = opt.desc || opt.label;

        btn.onclick = (function(n, val) {
          return function() { updateScore(n, val); };
        })(name, opt.value);

        actionsDiv.appendChild(btn);
      });
    }

    var del = document.createElement("button");
    del.className = "small-btn";
    del.textContent = "×";
    del.title = "Remove player";
    del.style.fontSize = "1.2rem";
    del.onclick = (function(n) {
      return function() { removePlayer(n); };
    })(name);

    actionsDiv.appendChild(del);

    row.appendChild(leftDiv);
    row.appendChild(actionsDiv);
    playersDiv.appendChild(row);
  });
}

/* ==================== INIT ==================== */
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
