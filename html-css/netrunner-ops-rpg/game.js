// game.js
// Core loop for the NetRunner Ops RPG

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogueBox = document.getElementById("dialogueBox");

let keys = {};

// Player & game state
const gameState = {
  player: {
    x: 2 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: 24,
    height: 24,
    speed: 2,
    color: "#0ff",
  },
  operator: {
    handle: "Operator",
    roleKey: null,
    roleName: null,
    stealth: 0,
    tech: 0,
    social: 0,
    xp: 0,
    credits: 0,
    level: 1,
    detection: 0,
    intel: {
      recon: false,
      scan: false,
      credentialEdge: false,
      backdoor: false,
    },
  },
  contract: {
    active: false,
    name: "Baseline Training Contract",
    difficulty: 1,
    baseReward: 80,
  },
  dialogueLines: [],
  dialogueVisible: false,
};

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- Drawing ----------

function drawTile(x, y, tile) {
  if (tile === 1) {
    ctx.fillStyle = "#111827";
  } else {
    ctx.fillStyle = "#1f2937";
  }
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

  if (tile === 0) {
    // slight grid line for vibe
    ctx.strokeStyle = "rgba(15,23,42,0.8)";
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  }
}

function drawMap() {
  for (let row = 0; row < worldMap.length; row++) {
    for (let col = 0; col < worldMap[row].length; col++) {
      drawTile(col * TILE_SIZE, row * TILE_SIZE, worldMap[row][col]);
    }
  }
}

function drawObjects() {
  for (const obj of objects) {
    ctx.fillStyle = obj.color || "#fbbf24";
    ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
  }
}

function drawPlayer() {
  const p = gameState.player;
  ctx.fillStyle = p.color;
  ctx.fillRect(p.x + 4, p.y + 4, p.width, p.height);
}

// ---------- Dialogue ----------

function showDialogue(lines) {
  gameState.dialogueLines = lines;
  dialogueBox.textContent = lines.join("\n");
  dialogueBox.style.display = "block";
  gameState.dialogueVisible = true;
}

function hideDialogue() {
  dialogueBox.style.display = "none";
  gameState.dialogueVisible = false;
  gameState.dialogueLines = [];
}

// ---------- Collision & interaction ----------

function isWallAtPixel(pixelX, pixelY) {
  const col = Math.floor(pixelX / TILE_SIZE);
  const row = Math.floor(pixelY / TILE_SIZE);
  if (
    row < 0 ||
    row >= worldMap.length ||
    col < 0 ||
    col >= worldMap[0].length
  ) {
    return true; // outside map = treat as wall
  }
  return worldMap[row][col] === 1;
}

function canMoveTo(newX, newY) {
  const p = gameState.player;
  // Check corners of player bounding box
  const corners = [
    [newX, newY],
    [newX + p.width, newY],
    [newX, newY + p.height],
    [newX + p.width, newY + p.height],
  ];
  for (const [x, y] of corners) {
    if (isWallAtPixel(x, y)) return false;
  }
  return true;
}

function getNearbyObject() {
  const p = gameState.player;
  const pxCenterX = p.x + p.width / 2;
  const pxCenterY = p.y + p.height / 2;

  for (const obj of objects) {
    const oxCenterX = obj.x + obj.width / 2;
    const oxCenterY = obj.y + obj.height / 2;
    const dist = Math.hypot(pxCenterX - oxCenterX, pxCenterY - oxCenterY);
    if (dist < 32) {
      return obj;
    }
  }
  return null;
}

// ---------- Operator / mission logic ----------

function setRole(roleKey) {
  const op = gameState.operator;
  const roles = {
    brute: {
      name: "Brute Forcer",
      stealth: 2,
      tech: 5,
      social: 2,
    },
    social: {
      name: "Social Engineer",
      stealth: 4,
      tech: 2,
      social: 5,
    },
    analyst: {
      name: "Analyst",
      stealth: 3,
      tech: 4,
      social: 3,
    },
  };

  const role = roles[roleKey];
  if (!role) return;

  op.roleKey = roleKey;
  op.roleName = role.name;
  op.stealth = role.stealth;
  op.tech = role.tech;
  op.social = role.social;

  showDialogue([
    `Role set to ${role.name}.`,
    `Stats → Stealth ${op.stealth}, Tech ${op.tech}, Social ${op.social}.`,
    "Now head to the mission console on the right to accept a contract.",
  ]);
}

function adjustDetection(amount) {
  const op = gameState.operator;
  op.detection = Math.max(0, Math.min(100, op.detection + amount));
}

function addXP(amount) {
  const op = gameState.operator;
  op.xp += amount;
  const needed = op.level * 50;
  if (op.xp >= needed) {
    op.level++;
    op.xp -= needed;
    op.stealth++;
    op.tech++;
    op.social++;
    showDialogue([
      "LEVEL UP!",
      `You reach level ${op.level}.`,
      `Your skills improve → Stealth ${op.stealth}, Tech ${op.tech}, Social ${op.social}.`,
    ]);
  }
}

function addCredits(amount) {
  const op = gameState.operator;
  op.credits += amount;
}

function resetIntelAndDetection() {
  const op = gameState.operator;
  op.detection = 0;
  op.intel = {
    recon: false,
    scan: false,
    credentialEdge: false,
    backdoor: false,
  };
}

function requireRoleAndContract(forAction = false) {
  const op = gameState.operator;
  if (!op.roleKey) {
    showDialogue([
      "You haven't chosen a role yet.",
      "Talk to one of the mentors in the center area to set your role.",
    ]);
    return false;
  }
  if (forAction && !gameState.contract.active) {
    showDialogue([
      "No active contract.",
      "Use the mission console on the right to accept a training contract first.",
    ]);
    return false;
  }
  return true;
}

// Action logic reused from terminal version but simplified for this UI
function performAction(action) {
  const op = gameState.operator;
  const c = gameState.contract;

  if (!requireRoleAndContract(true)) return;

  if (action === "recon") {
    let baseChance = 70 + op.stealth * 3;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.recon = true;
      adjustDetection(2);
      addXP(5 * c.difficulty);
      showDialogue([
        "Recon successful.",
        "You map infrastructure and spot weak points.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(8);
      showDialogue([
        "Recon attempt yielded little intel and raised some suspicion.",
        `Detection: ${op.detection}/100`,
      ]);
    }
  } else if (action === "scan") {
    let baseChance = 60 + op.tech * 3;
    if (op.intel.recon) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.scan = true;
      adjustDetection(10);
      addXP(8 * c.difficulty);
      showDialogue([
        "Scan successful.",
        "You identify misconfigurations in the simulated environment.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(20);
      showDialogue([
        "Scan is noisy and triggers increased monitoring in the sim.",
        `Detection: ${op.detection}/100`,
      ]);
    }
  } else if (action === "phish") {
    let baseChance = 50 + op.social * 4;
    if (op.intel.recon) baseChance += 5;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.credentialEdge = true;
      adjustDetection(8);
      addXP(10 * c.difficulty);
      showDialogue([
        "Simulated user falls for your phishing scenario.",
        "Training portal logs credentials for review.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(15);
      showDialogue([
        "Simulated user reports your message. Security tightens.",
        `Detection: ${op.detection}/100`,
      ]);
    }
  } else if (action === "brute") {
    let baseChance = 40 + op.tech * 4;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.backdoor = true;
      adjustDetection(20);
      addXP(12 * c.difficulty);
      showDialogue([
        "Aggressive simulated brute-force discloses a weak control.",
        "A training backdoor route becomes available.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(30);
      showDialogue([
        "Defensive logs show clear brute-force patterns.",
        "The training environment treats you as noisy.",
        `Detection: ${op.detection}/100`,
      ]);
    }
  } else if (action === "backdoor") {
    let baseChance = 45 + op.tech * 3 + op.stealth * 2;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.backdoor = true;
      adjustDetection(15);
      addXP(15 * c.difficulty);
      showDialogue([
        "Backdoor established in the simulated environment.",
        "Future actions become more forgiving.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(25);
      showDialogue([
        "Persistence attempts are flagged in training logs.",
        "Defensive systems heighten their response.",
        `Detection: ${op.detection}/100`,
      ]);
    }
  } else if (action === "exfiltrate") {
    let baseChance = 30 + op.tech * 3 + op.stealth * 2;
    if (op.intel.recon) baseChance += 5;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    if (op.intel.backdoor) baseChance += 10;

    baseChance -= Math.floor(op.detection / 3);
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      const reward = c.baseReward + randomBetween(0, 30);
      addCredits(reward);
      addXP(25 * c.difficulty);
      showDialogue([
        "MISSION SUCCESS:",
        "You complete the training objectives and exfiltrate simulated data.",
        `Reward: ${reward} credits.`,
        `Total credits: ${op.credits}.`,
      ]);
      gameState.contract.active = false;
      resetIntelAndDetection();
    } else {
      adjustDetection(30);
      addXP(10 * c.difficulty);
      showDialogue([
        "MISSION FAILED:",
        "The training environment detects your activity before completion.",
        `Detection: ${op.detection}/100`,
      ]);
      gameState.contract.active = false;
      resetIntelAndDetection();
    }
  }

  if (gameState.operator.detection >= 100) {
    showDialogue([
      "FULL DETECTION:",
      "The simulation triggers a complete lockout.",
      "Your detection resets for the next run.",
    ]);
    resetIntelAndDetection();
    gameState.contract.active = false;
  }
}

function handleContractConsole() {
  if (!requireRoleAndContract(false)) return;
  const op = gameState.operator;
  const c = gameState.contract;

  if (!gameState.contract.active) {
    gameState.contract.active = true;
    resetIntelAndDetection();
    showDialogue([
      "Training contract accepted:",
      `\"${c.name}\" (Difficulty ${c.difficulty}).`,
      "Use the terminals below to perform actions.",
      "Finish at the Exfil terminal to try to complete the mission.",
      `Current credits: ${op.credits}.`,
    ]);
  } else {
    showDialogue([
      "You already have an active contract.",
      "Use action terminals in the lower area or finish at the Exfil terminal.",
      `Detection: ${op.detection}/100`,
    ]);
  }
}

// ---------- Interactions ----------

function handleInteraction(obj) {
  if (!obj) {
    showDialogue([
      "No one is close enough to interact.",
      "Move closer to an NPC or a terminal and press E/Space.",
    ]);
    return;
  }

  if (obj.type === "npc") {
    showDialogue(obj.lines);
  } else if (obj.type === "roleNpc") {
    showDialogue(obj.lines);
    setRole(obj.roleKey);
  } else if (obj.type === "terminalContract") {
    handleContractConsole();
  } else if (obj.type === "terminalAction") {
    // First show flavor text, then perform action
    showDialogue(obj.lines);
    // Quick little delay so dialogue is visible; then perform action too
    setTimeout(() => performAction(obj.action), 250);
  }
}

// ---------- Update & loop ----------

function update() {
  const p = gameState.player;
  let newX = p.x;
  let newY = p.y;

  if (keys["ArrowUp"]) newY -= p.speed;
  if (keys["ArrowDown"]) newY += p.speed;
  if (keys["ArrowLeft"]) newX -= p.speed;
  if (keys["ArrowRight"]) newX += p.speed;

  if (canMoveTo(newX, p.y)) p.x = newX;
  if (canMoveTo(p.x, newY)) p.y = newY;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawObjects();
  drawPlayer();
  update();
  requestAnimationFrame(gameLoop);
}

// ---------- Input ----------

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (e.key === "e" || e.key === "E" || e.key === " ") {
    e.preventDefault();
    if (gameState.dialogueVisible) {
      // Close dialogue on E/Space if open
      hideDialogue();
    } else {
      const obj = getNearbyObject();
      handleInteraction(obj);
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ---------- Init ----------

function init() {
  showDialogue([
    "NetRunner Ops RPG:",
    "Arrow keys: move",
    "E / Space: interact with NPCs & terminals.",
    "",
    "Step 1: Talk to a role mentor in the central area.",
    "Step 2: Use the contract console on the right.",
    "Step 3: Use action terminals below and finish at Exfil.",
  ]);
  gameLoop();
}

init();
