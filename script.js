/* ==================== STATE ==================== */
var tambolaNumbers = Array.from({ length: 90 }, function(_, i) { return i + 1; });
var players = {};

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

/* ==================== DICE ==================== */
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
    tambolaNumber.textContent = "🎉 Done!";
    pop(tambolaNumber);
    vibrate([80, 50, 80]);
    return;
  }

  var index = Math.floor(Math.random() * tambolaNumbers.length);
  var num = tambolaNumbers.splice(index, 1)[0];

  tambolaNumber.textContent = num;
  pop(tambolaNumber);

  var chip = document.createElement("span");
  chip.textContent = num;
  tambolaHistory.appendChild(chip);

  vibrate(50);
}

function resetTambola() {
  tambolaNumbers = Array.from({ length: 90 }, function(_, i) { return i + 1; });
  document.getElementById("tambolaNumber").textContent = "---";
  document.getElementById("tambolaHistory").innerHTML = "";
  vibrate(30);
}

/* ==================== COIN ==================== */
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

  var finalRotation = isHeads ? 1440 : 1620; // 1440 = heads (0deg), 1620 = tails (180deg)
  
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

  var pick = opts[Math.floor(Math.random() * opts.length)];
  decisionResult.innerHTML = "<strong>🎯 " + escapeHtml(pick) + "</strong>";
  pop(decisionResult);
  vibrate([40, 60, 40]);
}

/* ==================== SCOREBOARD ==================== */
function addPlayer() {
  var input = document.getElementById("playerName");
  var name = input.value.trim();
  
  if (!name) {
    vibrate(100);
    return;
  }

  if (players[name] === undefined) {
    players[name] = 0;
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

function renderPlayers() {
  var playersDiv = document.getElementById("players");
  if (!playersDiv) return;
  
  playersDiv.innerHTML = "";

  var names = Object.keys(players);
  
  if (names.length === 0) {
    var empty = document.createElement("div");
    empty.style.color = "var(--muted)";
    empty.style.padding = "10px 2px";
    empty.style.textAlign = "center";
    empty.textContent = "No players yet. Add a name above.";
    playersDiv.appendChild(empty);
    return;
  }

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

    var btn10 = document.createElement("button");
    btn10.className = "small-btn";
    btn10.textContent = "+10";
    btn10.onclick = function() { updateScore(name, 10); };

    var btnMinus = document.createElement("button");
    btnMinus.className = "small-btn danger";
    btnMinus.textContent = "-10";
    btnMinus.onclick = function() { updateScore(name, -10); };

    var btnDel = document.createElement("button");
    btnDel.className = "small-btn";
    btnDel.textContent = "Del";
    btnDel.onclick = function() { removePlayer(name); };

    actionsDiv.appendChild(btn10);
    actionsDiv.appendChild(btnMinus);
    actionsDiv.appendChild(btnDel);

    row.appendChild(leftDiv);
    row.appendChild(actionsDiv);

    playersDiv.appendChild(row);
  });
}

/* ==================== UTILITY ==================== */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==================== INIT ==================== */
window.addEventListener("DOMContentLoaded", function() {
  setActiveNav("dice");
  renderPlayers();
  
  var diceDisplay = document.getElementById("diceDisplay");
  if (diceDisplay) {
    diceDisplay.innerHTML = '<div class="simple-dice">' + createDiceFace(1) + '</div>';
  }
});
