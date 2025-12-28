// Global state
let tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
let players = {};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  createParticles();
  setActiveNav();
});

// Create floating particles background
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (15 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

// Vibration feedback (works on mobile)
function vibrate(duration = 50) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// Show section with smooth transition
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  setActiveNav();
  vibrate(30);
}

// Highlight active navigation button
function setActiveNav() {
  const activeSection = document.querySelector('.section.active');
  const sectionId = activeSection?.id;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.getAttribute('data-section') === sectionId) {
      btn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
      btn.style.color = '#020617';
    } else {
      btn.style.background = 'var(--glass)';
      btn.style.color = 'var(--text)';
    }
  });
}



// 🔢 TAMBOLA with number cycling animation
function pickTambola() {
  const display = document.querySelector('.number-large') || document.getElementById('tambolaNumber');
  const history = document.getElementById('tambolaHistory');
 // 🎲 DICE ROLLER - Fixed and Simplified
function rollDice() {
  const display = document.getElementById('diceDisplay');
  const result = document.getElementById('diceResult');
  const sides = Number(document.getElementById('diceSides').value) || 6;
  const count = Number(document.getElementById('diceCount').value) || 1;
  
  // Validation
  if (!sides || sides < 2) {
    showError(result, "⚠️ Enter valid dice sides (min: 2)");
    vibrate(200);
    return;
  }
  
  if (count < 1 || count > 10) {
    showError(result, "⚠️ Number of dice: 1-10");
    vibrate(200);
    return;
  }
  
  vibrate(100);
  
  // Clear display and show rolling animation
  display.innerHTML = '';
  result.textContent = '🎲 Rolling...';
  
  // Create dice elements
  const diceElements = [];
  for (let i = 0; i < count; i++) {
    const dice = document.createElement('div');
    dice.className = 'simple-dice rolling';
    
    if (sides === 6) {
      // Show dots for standard dice
      dice.innerHTML = '<div class="dice-dots"></div>';
    } else {
      // Show number for non-standard dice
      dice.innerHTML = '<div class="dice-number">?</div>';
    }
    
    display.appendChild(dice);
    diceElements.push(dice);
  }
  
  // Roll after animation
  setTimeout(() => {
    const results = [];
    
    for (let i = 0; i < count; i++) {
      const roll = Math.floor(Math.random() * sides) + 1;
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
