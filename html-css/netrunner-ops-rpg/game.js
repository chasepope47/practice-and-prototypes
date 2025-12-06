// game.js
// Core loop for the NetRunner Ops RPG

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogueBox = document.getElementById("dialogueBox");

// ---- SPRITE ASSETS ----
const sprites = {
  tiles: new Image(),
  player: new Image(),
  npc: new Image(),
  terminal: new Image(),
};

sprites.tiles.src = "assets/tiles.png";
sprites.player.src = "assets/player.png";

sprites.player.onload = () => {
  console.log("Player sprite loaded:", sprites.player.naturalWidth, sprites.player.naturalHeight);
};
sprites.player.onerror = () => {
  console.error("FAILED to load player sprite at assets/player.png");
};


sprites.npc.src = "assets/npc.png";
sprites.terminal.src = "assets/terminal.png";

let currentRoomKey = "lobby";

const ROOM_DISPLAY_NAMES = {
  lobby: "Lobby",
  roleHub: "Role Hub",
  ops: "Operations",
};

// Techy fade transition state
const transition = {
  active: false,
  phase: "idle",      // "idle" | "fadeOut" | "fadeIn"
  alpha: 0,
  targetRoom: null,
  targetSpawn: null,
  lines: null,
};

function startRoomTransition(targetRoom, targetSpawn, lines) {
  transition.active = true;
  transition.phase = "fadeOut";
  transition.alpha = 0;
  transition.targetRoom = targetRoom;
  transition.targetSpawn = targetSpawn || null;
  transition.lines = lines || null;
}

function updateTransition() {
  if (!transition.active) return;

  const speed = 0.08; // tweak for faster/slower fade

  if (transition.phase === "fadeOut") {
    transition.alpha += speed;
    if (transition.alpha >= 1) {
      transition.alpha = 1;
      // swap room when fully dark
      if (transition.targetRoom) {
        loadRoom(transition.targetRoom, transition.targetSpawn);
        // optional: show dialogue AFTER arriving
        if (transition.lines) {
          showDialogue(transition.lines);
        }
      }
      transition.phase = "fadeIn";
    }
  } else if (transition.phase === "fadeIn") {
    transition.alpha -= speed;
    if (transition.alpha <= 0) {
      transition.alpha = 0;
      transition.active = false;
      transition.phase = "idle";
      transition.targetRoom = null;
      transition.targetSpawn = null;
      transition.lines = null;
    }
  }
}

function drawTransitionOverlay() {
  if (!transition.active || transition.alpha <= 0) return;

  ctx.save();

  // Dark techy background
  ctx.globalAlpha = transition.alpha * 0.9;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Scanline effect
  ctx.globalAlpha = transition.alpha * 0.35;
  ctx.fillStyle = "#0f172a";
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }

  // "TRANSFERRING..." text in the middle when fully in motion
  ctx.globalAlpha = transition.alpha;
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#22c55e";
  ctx.fillText("TRANSFERRING...", canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

function drawHUD() {
  const op = gameState.operator;
  const roomName = ROOM_DISPLAY_NAMES[currentRoomKey] || currentRoomKey;

  // Background bar
  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.fillRect(0, 0, canvas.width, 32);

  ctx.font = "12px monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e5e7eb";

  // Left: room
  ctx.textAlign = "left";
  ctx.fillText(`Room: ${roomName}`, 8, 16);

  // Center: role + level
  const roleDisplay = op.roleName ? `${op.roleName} (Lv ${op.level})` : "No role selected";
  ctx.textAlign = "center";
  ctx.fillText(`Role: ${roleDisplay}`, canvas.width / 2, 16);

  // Right: credits + detection
  ctx.textAlign = "right";
  ctx.fillText(
    `Credits: ${op.credits}  Det: ${op.detection}%`,
    canvas.width - 8,
    16
  );

  ctx.restore();
}

function loadRoom(key, spawnOverride) {
  currentRoomKey = key;
  const room = rooms[key];
  worldMap = room.worldMap;
  objects = room.objects;

  const spawn = spawnOverride || room.spawn;
  // Center the player sprite inside the tile so the visual aligns with the map
  const px = spawn.x + Math.floor((TILE_SIZE - gameState.player.width) / 2);
  const py = spawn.y + Math.floor((TILE_SIZE - gameState.player.height) / 2);
  gameState.player.x = px;
  gameState.player.y = py;
}

sprites.player.onload = () => {
  console.log("Player sprite loaded:", sprites.player.naturalWidth, sprites.player.naturalHeight);
};
sprites.player.onerror = () => {
  console.error("FAILED to load player sprite at assets/player.png");
};

let keys = {};

// Player & game state
const gameState = {
  player: {
    x: 7 * TILE_SIZE,    // center column
    y: 8 * TILE_SIZE,    // lobby row
    width: 27,
    height: 27,
    speed: 2,
    color: "#0ff", // used only as fallback
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
    // WALL
    const grd = ctx.createLinearGradient(x, y, x, y + TILE_SIZE);
    grd.addColorStop(0, "#020617");
    grd.addColorStop(1, "#0b1120");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.strokeStyle = "rgba(15,23,42,0.9)";
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  } else {
    // FLOOR
    const grd = ctx.createLinearGradient(x, y, x + TILE_SIZE, y + TILE_SIZE);
    grd.addColorStop(0, "#111827");
    grd.addColorStop(1, "#1f2937");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.strokeStyle = "rgba(31,41,55,0.6)";
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  }
}

function drawMap() {
  // DEBUG: draw raw player sheet in top-left so we know it loads
  if (sprites.player.naturalWidth) {
    // draw a small thumbnail of the whole sprite sheet so we can inspect layout
    const sw = sprites.player.naturalWidth;
    const sh = sprites.player.naturalHeight;
    const thumbW = 160;
    const thumbH = Math.floor((thumbW * sh) / sw);
    ctx.drawImage(sprites.player, 0, 0, sw, sh, 0, 0, thumbW, thumbH);
  }

  for (let row = 0; row < worldMap.length; row++) {
    for (let col = 0; col < worldMap[row].length; col++) {
      drawTile(col * TILE_SIZE, row * TILE_SIZE, worldMap[row][col]);
    }
  }
}

function drawObjects() {
  ctx.font = "10px monospace";
  ctx.textBaseline = "bottom";

  for (const obj of objects) {
    // Draw labels/signs if present
    if (obj.labelText) {
      ctx.fillStyle = obj.labelColor || "#e5e7eb";
      ctx.textAlign = "center";
      ctx.fillText(
        obj.labelText,
        obj.x + obj.width / 2,
        obj.y - 4 // just above the object
      );
    }

    if (obj.type === "npc" || obj.type === "roleNpc") {
      // Use npc.png sheet, pick a single “idle facing down” frame
      if (sprites.npc.complete && sprites.npc.naturalWidth) {
        const cols = 3;
        const rows = 4;
        const frameWidth = sprites.npc.naturalWidth / cols;
        const frameHeight = sprites.npc.naturalHeight / rows;
        const frameX = 1; // middle frame
        const frameY = 0; // first row = facing down

        ctx.drawImage(
          sprites.npc,
          frameX * frameWidth,
          frameY * frameHeight,
          frameWidth,
          frameHeight,
          obj.x,
          obj.y,
          obj.width,
          obj.height
        );
      } else {
        ctx.fillStyle = obj.color || "#fbbf24";
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
      }
    } else if (
      obj.type === "terminalContract" ||
      obj.type === "terminalAction"
    ) {
      // Single-sprite terminal
      if (sprites.terminal.complete && sprites.terminal.naturalWidth) {
        ctx.drawImage(
          sprites.terminal,
          0,
          0,
          sprites.terminal.naturalWidth,
          sprites.terminal.naturalHeight,
          obj.x,
          obj.y,
          obj.width,
          obj.height
        );
      } else {
        ctx.fillStyle = obj.color || "#38bdf8";
        ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
      }
    } else if (obj.type === "door") {
      // Door sprite: simple lit frame to stand out
      ctx.fillStyle = "#020617";
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
    } else {
      // Any other object type, fallback rectangle
      ctx.fillStyle = obj.color || "#e5e7eb";
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
    }
  }
}

function drawPlayer() {
  const p = gameState.player;

  if (sprites.player.complete && sprites.player.naturalWidth) {
    const sheet = sprites.player;
    const frameWidth = sheet.naturalWidth / playerSprite.cols;   // 128 pixels
    const frameHeight = sheet.naturalHeight / playerSprite.rows;  // 322 pixels

    // Crop a centered square from the source frame so tall frames don't clip.
    const cropSize = Math.min(frameWidth, frameHeight);
    const srcX = playerSprite.frameX * frameWidth + Math.floor((frameWidth - cropSize) / 2);
    const srcY = playerSprite.frameY * frameHeight + Math.floor((frameHeight - cropSize) / 2);

    ctx.drawImage(
      sheet,
      srcX,
      srcY,
      cropSize,
      cropSize,
      p.x,
      p.y,
      p.width,
      p.height
    );
  } else {
    // fallback while loading
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }
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

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}

function checkDoorTransition() {
  const p = gameState.player;

  for (const obj of objects) {
    if (obj.type === "door") {
      if (rectsOverlap(p.x, p.y, p.width, p.height, obj.x, obj.y, obj.width, obj.height)) {
        loadRoom(obj.targetRoom, obj.targetSpawn);
        if (obj.lines) showDialogue(obj.lines);
        return; // only handle one door per frame
      }
    }
  }
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
      "No one or no door is close enough to interact.",
      "Move closer and press SPACE.",
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
  } else if (obj.type === "door") {
    if (obj.targetRoom) {
      startRoomTransition(obj.targetRoom, obj.targetSpawn, obj.lines);
      }
    }
  }

// ---------- Update & loop & movement ----------
function animatePlayer(moving) {
  if (moving) {
    playerSprite.frameTimer++;
    if (playerSprite.frameTimer >= playerSprite.frameInterval) {
      playerSprite.frameX = (playerSprite.frameX + 1) % playerSprite.cols; // 0–2
      playerSprite.frameTimer = 0;
    }
  } else {
    // idle = first column in the row
    playerSprite.frameX = 0;
    playerSprite.frameTimer = 0;
  }
}

function update() {
  if (transition.active) {
    updateTransition();
    return; // no movement while transitioning
  }
  
  const p = gameState.player;
  let newX = p.x;
  let newY = p.y;
  let moving = false;

  // Determine direction with priority (check in order: up, down, left, right)
  if (keys["ArrowUp"]) {
    newY -= p.speed;
    playerSprite.frameY = 3; // Up row
    playerSprite.lastDirection = "up";
    moving = true;
  } else if (keys["ArrowDown"]) {
    newY += p.speed;
    playerSprite.frameY = 0; // Down row
    playerSprite.lastDirection = "down";
    moving = true;
  } else if (keys["ArrowLeft"]) {
    newX -= p.speed;
    playerSprite.frameY = 1; // Left row
    playerSprite.lastDirection = "left";
    moving = true;
  } else if (keys["ArrowRight"]) {
    newX += p.speed;
    playerSprite.frameY = 2; // Right row
    playerSprite.lastDirection = "right";
    moving = true;
  } else {
    // No keys pressed - face the last direction
    const directionMap = {
      up: 3,
      down: 0,
      left: 1,
      right: 2,
    };
    playerSprite.frameY = directionMap[playerSprite.lastDirection];
  }

  // Collision-safe movement using your existing canMoveTo()
  if (canMoveTo(newX, p.y)) p.x = newX;
  if (canMoveTo(p.x, newY)) p.y = newY;

  animatePlayer(moving);
  // Doors are now triggered by interaction (Space), not auto-walk for now.
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawObjects();
  drawPlayer();
  drawHUD();     
  drawTransitionOverlay();    // <-- add this line
  update();
  requestAnimationFrame(gameLoop);
}


// ---------- Input ----------

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  if (transition.active) {
    return; // ignore input during fade
  }

  if (e.key === "e" || e.key === "E" || e.key === " ") {
    e.preventDefault();
    if (gameState.dialogueVisible) {
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
  loadRoom("lobby");

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
