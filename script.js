function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* Dice */
function rollDice() {
  const sides = Number(diceSides.value);
  const count = Number(diceCount.value) || 1;
  if (!sides) return alert("Enter dice sides");

  let results = [];
  for (let i = 0; i < count; i++) {
    results.push(Math.floor(Math.random() * sides) + 1);
  }
  diceResult.innerText = "Result: " + results.join(", ");
}

/* Tambola */
let tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);

function pickTambola() {
  if (tambolaNumbers.length === 0) {
    tambolaNumber.innerText = "Done!";
    return;
  }
  const index = Math.floor(Math.random() * tambolaNumbers.length);
  const num = tambolaNumbers.splice(index, 1)[0];
  tambolaNumber.innerText = num;

  const span = document.createElement("span");
  span.innerText = num;
  tambolaHistory.appendChild(span);
}

function resetTambola() {
  tambolaNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  tambolaNumber.innerText = "---";
  tambolaHistory.innerHTML = "";
}

/* Card Game Scorer */
let players = {};

function addPlayer() {
  const name = playerName.value.trim();
  if (!name) return;

  players[name] = players[name] || 0;
  renderPlayers();
  playerName.value = "";
}

function updateScore(name, delta) {
  players[name] += delta;
  renderPlayers();
}

function renderPlayers() {
  playersDiv = document.getElementById("players");
  playersDiv.innerHTML = "";
  for (let name in players) {
    const div = document.createElement("div");
    div.innerHTML = `
      <strong>${name}</strong>: ${players[name]}
      <button onclick="updateScore('${name}', 10)">+10</button>
      <button onclick="updateScore('${name}', -10)">-10</button>
    `;
    playersDiv.appendChild(div);
  }
}

/* Coin Toss */
function coinToss() {
  coinResult.innerText = Math.random() < 0.5 ? "HEADS" : "TAILS";
}

/* Decision Maker */
function makeDecision() {
  const opts = options.value.split(",").map(o => o.trim()).filter(Boolean);
  if (!opts.length) return;
  decisionResult.innerText = opts[Math.floor(Math.random() * opts.length)];
}
