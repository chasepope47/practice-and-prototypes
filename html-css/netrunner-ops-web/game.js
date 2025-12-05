const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const dialogueBox = document.getElementById("dialogueBox");

// Player
let player = {
  x: 2 * TILE_SIZE,
  y: 2 * TILE_SIZE,
  speed: 2,
  width: 28,
  height: 28
};

let keys = {};

// Load assets (placeholder colored tiles)
function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
}

function drawMap() {
  for (let row = 0; row < lobbyMap.length; row++) {
    for (let col = 0; col < lobbyMap[row].length; col++) {
      const tile = lobbyMap[row][col];
      drawTile(col*TILE_SIZE, row*TILE_SIZE, tile === 1 ? "#222" : "#444");
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "#0ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawNPCs() {
  npcs.forEach(npc => {
    ctx.fillStyle = "yellow";
    ctx.fillRect(npc.x, npc.y, TILE_SIZE, TILE_SIZE);
  });
}

function showDialogue(lines) {
  dialogueBox.innerText = lines.join("\n");
  dialogueBox.style.display = "block";
}

function hideDialogue() {
  dialogueBox.style.display = "none";
}

function checkCollision(newX, newY) {
  const col = Math.floor(newX / TILE_SIZE);
  const row = Math.floor(newY / TILE_SIZE);
  return lobbyMap[row][col] === 1;
}

function checkNPCInteraction() {
  for (let npc of npcs) {
    const dist = Math.hypot(player.x - npc.x, player.y - npc.y);
    if (dist < 40) {
      showDialogue(npc.text);
      return;
    }
  }
  hideDialogue();
}

function update() {
  let newX = player.x;
  let newY = player.y;

  if (keys["ArrowUp"]) newY -= player.speed;
  if (keys["ArrowDown"]) newY += player.speed;
  if (keys["ArrowLeft"]) newX -= player.speed;
  if (keys["ArrowRight"]) newX += player.speed;

  // Collision
  if (!checkCollision(newX, player.y)) player.x = newX;
  if (!checkCollision(player.x, newY)) player.y = newY;

  checkNPCInteraction();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  drawNPCs();
  drawPlayer();

  update();

  requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

gameLoop();
