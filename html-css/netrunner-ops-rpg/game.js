// game.js
// Core loop for the NetRunner Ops RPG

console.log("game.js loaded");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogueBox = document.getElementById("dialogueBox");

// ---- ROOM LOADING ----

function loadRoom(key, spawnOverride) {
  currentRoomKey = key;
  const room = rooms[key];

  worldMap = room.worldMap;
  objects = room.objects;

  console.log("loadRoom:", key, "objects:", objects ? objects.length : 0);

  const spawn = spawnOverride || room.spawn;
  const px = spawn.x + Math.floor((TILE_SIZE - gameState.player.width) / 2);
  const py = spawn.y + Math.floor((TILE_SIZE - gameState.player.height) / 2);
  gameState.player.x = px;
  gameState.player.y = py;
}

// ---- MAP & OBJECT DRAWING ----

function drawTile(x, y, tile) {
  if (tile === 1) {
    const grd = ctx.createLinearGradient(x, y, x, y + TILE_SIZE);
    grd.addColorStop(0, "#020617");
    grd.addColorStop(1, "#0b1120");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);

    ctx.strokeStyle = "rgba(15,23,42,0.9)";
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  } else {
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
  for (let row = 0; row < worldMap.length; row++) {
    for (let col = 0; col < worldMap[row].length; col++) {
      drawTile(col * TILE_SIZE, row * TILE_SIZE, worldMap[row][col]);
    }
  }
}

function drawObjects() {
  if (!Array.isArray(objects) || objects.length === 0) return;

  ctx.font = "10px monospace";
  ctx.textBaseline = "bottom";

  for (const obj of objects) {
    // debug hitbox
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#f472b6";
    ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
    ctx.restore();

    // label above object, if any
    if (obj.labelText) {
      ctx.fillStyle = obj.labelColor || "#e5e7eb";
      ctx.textAlign = "center";
      ctx.fillText(
        obj.labelText,
        obj.x + obj.width / 2,
        obj.y - 4
      );
    }

    if (obj.type === "npc" || obj.type === "roleNpc") {
      if (sprites.npc && sprites.npc.complete && sprites.npc.naturalWidth) {
        const cols = 3;
        const rows = 4;
        const frameWidth = sprites.npc.naturalWidth / cols;
        const frameHeight = sprites.npc.naturalHeight / rows;
        const frameX = 1;
        const frameY = 0;

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
    } else if (obj.type === "terminalContract" || obj.type === "terminalAction") {
      if (sprites.terminal && sprites.terminal.complete && sprites.terminal.naturalWidth) {
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
      ctx.fillStyle = "#020617";
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
    } else if (obj.type === "terminalHub") {
      // ROLE HUB green box
      ctx.fillStyle = "#020617";
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
    } else {
      ctx.fillStyle = obj.color || "#e5e7eb";
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.width - 8, obj.height - 8);
    }
  }
}

// ---- MOVEMENT COLLISION (just for walls) ----

function isWallAtPixel(pixelX, pixelY) {
  const col = Math.floor(pixelX / TILE_SIZE);
  const row = Math.floor(pixelY / TILE_SIZE);
  if (
    row < 0 ||
    row >= worldMap.length ||
    col < 0 ||
    col >= worldMap[0].length
  ) {
    return true;
  }
  return worldMap[row][col] === 1;
}

function canMoveTo(newX, newY) {
  const p = gameState.player;
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

// ---- UPDATE & LOOP ----

function update() {
  // transition state & overlay are handled in ui.js
  if (transition.active) {
    updateTransition();
    return;
  }

  // when in terminal, freeze world movement
  if (terminalMode) {
    return;
  }

  const p = gameState.player;
  let newX = p.x;
  let newY = p.y;
  let moving = false;

  if (keys["ArrowUp"]) {
    newY -= p.speed;
    playerSprite.frameY = 2;
    playerSprite.lastDirection = "up";
    moving = true;
  } else if (keys["ArrowDown"]) {
    newY += p.speed;
    playerSprite.frameY = 1;
    playerSprite.lastDirection = "down";
    moving = true;
  } else if (keys["ArrowLeft"]) {
    newX -= p.speed;
    playerSprite.frameY = 0;
    playerSprite.lastDirection = "left";
    moving = true;
  } else if (keys["ArrowRight"]) {
    newX += p.speed;
    playerSprite.frameY = 0;
    playerSprite.lastDirection = "right";
    moving = true;
  } else {
    const directionMap = { up: 2, down: 1, left: 0, right: 0 };
    playerSprite.frameY = directionMap[playerSprite.lastDirection];
  }

  if (canMoveTo(newX, p.y)) p.x = newX;
  if (canMoveTo(p.x, newY)) p.y = newY;

  animatePlayer(moving);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  drawObjects();
  drawPlayer();          // from player.js
  drawHUD();             // from ui.js
  drawTransitionOverlay(); // from ui.js

  if (terminalMode) {
    drawTerminalUI();    // from terminal.js
  } else {
    drawInteractionHint(); // from interaction.js
  }

  update();
  requestAnimationFrame(gameLoop);
}

// ---- INPUT ----

window.addEventListener("keydown", (e) => {
  if (
    e.key === "ArrowUp" ||
    e.key === "ArrowDown" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowRight" ||
    e.key === " "
  ) {
    e.preventDefault();
  }

  keys[e.key] = true;

  if (transition.active) return;

  // In ROLE HUB terminal mode: handle menu keys instead of world interaction
  if (terminalMode) {
    // allow closing dialogue first
    if (
      (e.key === "e" || e.key === "E" || e.key === " ") &&
      gameState.dialogueVisible
    ) {
      hideDialogue();
      return;
    }

    handleTerminalKey(e);  // from terminal.js
    return;
  }

  // Normal world interaction
  if (e.key === " " || e.key === "e" || e.key === "E") {
    if (gameState.dialogueVisible) {
      hideDialogue();
    } else {
      const obj = getNearbyObject(); // from interaction.js
      handleInteraction(obj);        // from interaction.js
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ---- INIT ----

function init() {
  loadRoom("lobby");

  showDialogue([
    "NetRunner Ops RPG:",
    "Arrow keys: move",
    "Space: enter doors",
    "E: interact with NPCs & terminals.",
    "",
    "Step 1: Talk to a role mentor in the central area.",
    "Step 2: Use the contract console on the right.",
    "Step 3: Use action terminals below and finish at Exfil.",
  ]);

  gameLoop();
}

init();
