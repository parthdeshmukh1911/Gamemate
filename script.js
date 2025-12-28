/* ========= State ========= */
let tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
let players = {};

/* ========= Helpers ========= */
function vibrate(pattern = 40) {
  if ("vibrate" in navigator) navigator.vibrate(pattern);
}

function pop(el) {
  el.classList.remove("pop");
  // restart animation
  void el.offsetWidth;
  el.classList.add("pop");
}

function setActiveNav(sectionId) {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.section === sectionId);
  });
}

/* ========= Navigation ========= */
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  const active = document.getElementById(id);
  if (active) active.classList.add("active");
  setActiveNav(id);
  vibrate(20);
}

/* ========= Dice (FIXED) ========= */
function rollDice() {
  const sides = Number(document.getElementById("diceSides").value) || 6;
  const count = Number(document.getElementById("diceCount").value) || 1;
  const diceDisplay = document.getElementById("diceDisplay");
  const diceResult = document.getElementById("diceResult");

  if (sides < 2) {
    diceResult.textContent = "Enter valid sides (min 2)";
    return;
  }
  if (count < 1 || count > 10) {
    diceResult.textContent = "Dice count must be 1 to 10";
    return;
  }

  vibrate(60);
  diceResult.textContent = "Rolling...";
  pop(diceResult);

  // Create N dice placeholders (simple UI)
  diceDisplay.innerHTML = "";
  const diceEls = [];
  for (let i = 0; i < count; i++) {
    const d = document.createElement("div");
    d.className = "simple-dice rolling";
    // temporary content while shaking
    d.innerHTML = sides === 6 ? `<div class="dice-dots"></div>` : `<div class="dice-number">?</div>`;
    diceDisplay.appendChild(d);
    diceEls.push(d);
  }

  // After shake animation: roll and render matching face per die
  setTimeout(() => {
    const results = [];
    for (let i = 0; i < count; i++) {
      const value = Math.floor(Math.random() * sides) + 1;
      results.push(value);

      const d = diceEls[i];
      d.classList.remove("rolling");

      // IMPORTANT: UI is set from the same 'value' used in results => always matches
      if (sides === 6) {
        d.innerHTML = createDiceFace(value);
      } else {
        d.innerHTML = `<div class="dice-number">${value}</div>`;
      }
    }

    const total = results.reduce((a, b) => a + b, 0);
    if (count === 1) {
      diceResult.innerHTML = `Result: <strong>${results[0]}</strong>`;
    } else if (count <= 5) {
      diceResult.innerHTML = `Result: <strong>${results.join(" + ")} = ${total}</strong>`;
    } else {
      diceResult.innerHTML = `Total: <strong>${total}</strong> (${results.join(", ")})`;
    }

    pop(diceResult);
    vibrate([30, 50, 30]);
  }, 560);
}

function createDiceFace(number) {
  const dotsCount = Math.min(Math.max(number, 1), 6);
  let dots = "";
  for (let i = 0; i < dotsCount; i++) dots += `<div class="dot"></div>`;
  return `<div class="dice-dots dice-face-${dotsCount}">${dots}</div>`;
}

/* ========= Tambola ========= */
function pickTambola() {
  const tambolaNumber = document.getElementById("tambolaNumber");
  const tambolaHistory = document.getElementById("tambolaHistory");

  if (tambolaNumbers.length === 0) {
    tambolaNumber.textContent = "Done!";
    pop(tambolaNumber);
    vibrate([80, 50, 80]);
    return;
  }

  const index = Math.floor(Math.random() * tambolaNumbers.length);
  const num = tambolaNumbers.splice(index, 1)[0];

  tambolaNumber.textContent = num;
  pop(tambolaNumber);

  const chip = document.createElement("span");
  chip.textContent = num;
  tambolaHistory.appendChild(chip);

  vibrate(50);
}

function resetTambola() {
  tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  document.getElementById("tambolaNumber").textContent = "---";
  document.getElementById("tambolaHistory").innerHTML = "";
  vibrate(30);
}

/* ========= Coin ========= */
function coinToss() {
  const coin = document.getElementById("coin3d");
  const coinResult = document.getElementById("coinResult");

  const isHeads = Math.random() < 0.5;
  coinResult.textContent = "Flipping...";
  pop(coinResult);
  vibrate(60);

  coin.classList.remove("flipping");
  void coin.offsetWidth;
  coin.classList.add("flipping");

  setTimeout(() => {
    coinResult.textContent = isHeads ? "HEADS" : "TAILS";
    pop(coinResult);
    vibrate([30, 70, 30]);
  }, 950);
}

/* ========= Decision Maker ========= */
function makeDecision() {
  const optionsEl = document.getElementById("options");
  const decisionResult = document.getElementById("decisionResult");

  const opts = optionsEl.value
    .split(",")
    .map(o => o.trim())
    .filter(Boolean);

  if (!opts.length) {
    decisionResult.textContent = "Enter options separated by commas";
    pop(decisionResult);
    vibrate(100);
    return;
  }

  const pick = opts[Math.floor(Math.random() * opts.length)];
  decisionResult.textContent = pick;
  pop(decisionResult);
  vibrate(40);
}

/* ========= Scoreboard ========= */
function addPlayer() {
  const input = document.getElementById("playerName");
  const name = input.value.trim();
  if (!name) return;

  if (players[name] == null) players[name] = 0;
  input.value = "";
  renderPlayers();
  vibrate(30);
}

function updateScore(name, delta) {
  players[name] = (players[name] || 0) + delta;
  renderPlayers();
  vibrate(20);
}

function removePlayer(name) {
  delete players[name];
  renderPlayers();
  vibrate(40);
}

function renderPlayers() {
  const playersDiv = document.getElementById("players");
  playersDiv.innerHTML = "";

  const names = Object.keys(players);
  if (names.length === 0) {
    const empty = document.createElement("div");
    empty.style.color = "var(--muted)";
    empty.style.padding = "10px 2px";
    empty.textContent = "No players yet. Add a player name above.";
    playersDiv.appendChild(empty);
    return;
  }

  names.forEach(name => {
    const row = document.createElement("div");
    row.className = "player-row";

    row.innerHTML = `
      <div>
        <div class="player-name">${escapeHtml(name)}</div>
        <div class="player-score">${players[name]}</div>
      </div>
      <div class="score-actions">
        <button class="small-btn" onclick="updateScore('${escapeAttr(name)}', 10)">+10</button>
        <button class="small-btn danger" onclick="updateScore('${escapeAttr(name)}', -10)">-10</button>
        <button class="small-btn" onclick="removePlayer('${escapeAttr(name)}')">Del</button>
      </div>
    `;

    playersDiv.appendChild(row);
  });
}

/* ========= Safety (simple escaping) ========= */
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// for inline onclick attributes
function escapeAttr(str) {
  return String(str).replaceAll("\\", "\\\\").replaceAll("'", "\\'");
}

/* ========= Init ========= */
window.addEventListener("DOMContentLoaded", () => {
  setActiveNav("dice");
  renderPlayers();

  // First render: show one dice placeholder
  const diceDisplay = document.getElementById("diceDisplay");
  diceDisplay.innerHTML = `<div class="simple-dice">${createDiceFace(1)}</div>`;
});      const roll = Math.floor(Math.random() * sides) + 1;
      results.push(roll);
      
      const dice = diceElements[i];
      dice.classList.remove('rolling');
      
      if (sides === 6) {
        // Show dots for 6-sided dice
        dice.innerHTML = createDiceFace(roll);
      } else {
        // Show number for other dice
        dice.innerHTML = `<div class="dice-number">${roll}</div>`;
      }
    }
    
    // Display result
    const total = results.reduce((a, b) => a + b, 0);
    let resultText;
    
    if (count === 1) {
      resultText = `<strong>Result: ${results[0]}</strong>`;
    } else if (count <= 5) {
      resultText = `<strong>${results.join(' + ')} = ${total}</strong>`;
    } else {
      resultText = `<strong>Total: ${total}</strong> (${results.join(', ')})`;
    }
    
    result.innerHTML = resultText;
    animateResult(result);
    vibrate([50, 100, 50]);
  }, 600);
}

// Create dice face with dots (for 6-sided dice)
function createDiceFace(number) {
  const dotCounts = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6
  };
  
  const count = dotCounts[number] || 1;
  let dots = '';
  
  for (let i = 0; i < count; i++) {
    dots += '<div class="dot"></div>';
  }
  
  return `<div class="dice-dots dice-face-${number}">${dots}</div>`;
} 
  if (tambolaNumbers.length === 0) {
    display.innerHTML = '<span style="font-size:2rem">🎉 Game Complete!</span>';
    vibrate([100, 50, 100, 50, 100]);
    return;
  }
  
  vibrate(100);
  display.style.color = 'var(--muted)';
  
  // Animate number cycling effect
  let cycles = 0;
  const interval = setInterval(() => {
    const tempNum = Math.floor(Math.random() * 90) + 1;
    display.textContent = tempNum;
    cycles++;
    
    if (cycles > 20) {
      clearInterval(interval);
      
      // Pick final number
      const index = Math.floor(Math.random() * tambolaNumbers.length);
      const num = tambolaNumbers.splice(index, 1)[0];
      
      display.textContent = num;
      display.style.color = '';
      animateResult(display);
      
      // Add to history with animation
      const span = document.createElement("span");
      span.textContent = num;
      span.style.opacity = '0';
      span.style.transform = 'scale(0)';
      history.appendChild(span);
      
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'scale(1)';
        span.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      }, 10);
      
      vibrate([50, 100, 50]);
    }
  }, 50);
}

function resetTambola() {
  tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  
  const display = document.querySelector('.number-large') || document.getElementById('tambolaNumber');
  const history = document.getElementById('tambolaHistory');
  
  display.textContent = "--";
  history.innerHTML = "";
  
  vibrate(50);
  
  // Flash animation
  display.style.animation = 'none';
  setTimeout(() => display.style.animation = 'pulse-glow 2s infinite', 10);
}

// 🪙 COIN TOSS with 3D flip animation
function coinToss() {
  const coin = document.getElementById('coin3d');
  const result = document.getElementById('coinResult');
  
  if (!coin || !result) {
    alert('Coin elements not found');
    return;
  }
  
  vibrate(100);
  result.textContent = '🪙 Flipping...';
  
  // Start flip animation
  coin.classList.add('flipping');
  
  setTimeout(() => {
    const isHeads = Math.random() < 0.5;
    
    // Set final rotation (add extra spins for effect)
    const baseRotation = isHeads ? 0 : 180;
    const extraSpins = 1800; // 5 full rotations
    coin.style.transform = `rotateY(${baseRotation + extraSpins}deg) rotateX(0deg)`;
    
    // Display result
    result.innerHTML = isHeads 
      ? '<strong style="color:#ffd700">🪙 HEADS</strong>' 
      : '<strong style="color:#c0c0c0">🪙 TAILS</strong>';
    
    animateResult(result);
    coin.classList.remove('flipping');
    vibrate([50, 100, 150]);
  }, 1000);
}

// 🎯 DECISION MAKER with roulette wheel
function makeDecision() {
  const input = document.getElementById('options');
  const result = document.getElementById('decisionResult');
  const wheel = document.getElementById('rouletteWheel');
  
  const opts = input.value.split(",").map(o => o.trim()).filter(Boolean);
  
  if (!opts.length) {
    showError(result, "⚠️ Enter options separated by commas");
    vibrate(200);
    return;
  }
  
  if (opts.length < 2) {
    showError(result, "⚠️ Need at least 2 options");
    vibrate(200);
    return;
  }
  
  vibrate(100);
  result.textContent = '🎯 Deciding...';
  
  // Spin roulette wheel if exists
  if (wheel) {
    wheel.classList.add('roulette-spinning');
  }
  
  // Cycle through options visually
  let cycles = 0;
  const cycleInterval = setInterval(() => {
    result.textContent = '🎯 ' + opts[cycles % opts.length];
    cycles++;
    
    if (cycles > 20) {
      clearInterval(cycleInterval);
      
      // Final decision
      const chosen = opts[Math.floor(Math.random() * opts.length)];
      result.innerHTML = `<strong style="color:var(--secondary)">🎯 ${chosen}</strong>`;
      
      animateResult(result);
      
      if (wheel) {
        wheel.classList.remove('roulette-spinning');
      }
      
      vibrate([50, 100, 150]);
    }
  }, 100);
}

// 🃏 CARD GAME SCORER (if you have this section)
function addPlayer() {
  const input = document.getElementById('playerName');
  const name = input.value.trim();
  
  if (!name) {
    alert("⚠️ Enter player name");
    return;
  }
  
  if (players[name]) {
    alert("⚠️ Player already exists");
    return;
  }
  
  players[name] = 0;
  renderPlayers();
  input.value = "";
  vibrate(50);
}

function updateScore(name, delta) {
  if (players[name] !== undefined) {
    players[name] += delta;
    renderPlayers();
    vibrate(30);
  }
}

function renderPlayers() {
  const playersDiv = document.getElementById("players");
  if (!playersDiv) return;
  
  playersDiv.innerHTML = "";
  
  for (let name in players) {
    const div = document.createElement("div");
    div.className = "player-card";
    div.style.cssText = `
      background: rgba(255,255,255,0.05);
      padding: 16px;
      border-radius: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid rgba(255,255,255,0.08);
    `;
    
    div.innerHTML = `
      <div style="flex:1">
        <strong style="font-size:1.1rem">${name}</strong>
        <div style="font-size:1.5rem; font-weight:800; color:var(--primary)">${players[name]}</div>
      </div>
      <div style="display:flex; gap:8px">
        <button onclick="updateScore('${name}', 10)" style="padding:8px 16px; border-radius:12px; border:none; background:linear-gradient(135deg, #10b981, #059669); color:#020617; font-weight:700; cursor:pointer;">+10</button>
        <button onclick="updateScore('${name}', -10)" style="padding:8px 16px; border-radius:12px; border:none; background:linear-gradient(135deg, #ef4444, #dc2626); color:white; font-weight:700; cursor:pointer;">-10</button>
      </div>
    `;
    
    playersDiv.appendChild(div);
  }
}

// Helper: Animate result display
function animateResult(element) {
  element.style.animation = 'none';
  setTimeout(() => {
    element.style.animation = 'pop-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  }, 10);
}

// Helper: Show error message
function showError(element, message) {
  const originalText = element.innerHTML;
  element.innerHTML = `<span style="color:#ef4444">${message}</span>`;
  element.style.animation = 'shake 0.5s';
  
  setTimeout(() => {
    element.innerHTML = originalText;
    element.style.animation = '';
  }, 2000);
}

// Add shake animation to CSS if not exists
if (!document.querySelector('#shake-animation')) {
  const style = document.createElement('style');
  style.id = 'shake-animation';
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    @keyframes pop-in {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}
