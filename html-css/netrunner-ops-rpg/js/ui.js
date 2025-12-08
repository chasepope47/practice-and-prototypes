// ui.js
// HUD, dialogue, and screen transition visuals.
//
// Depends on globals:
// - canvas, ctx, dialogueBox
// - gameState, currentRoomKey, ROOM_DISPLAY_NAMES

// ---- TRANSITION ("techy fade") ----
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

  const speed = 0.08;

  if (transition.phase === "fadeOut") {
    transition.alpha += speed;
    if (transition.alpha >= 1) {
      transition.alpha = 1;
      if (transition.targetRoom) {
        loadRoom(transition.targetRoom, transition.targetSpawn);
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

  ctx.globalAlpha = transition.alpha * 0.9;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = transition.alpha * 0.35;
  ctx.fillStyle = "#0f172a";
  for (let y = 0; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }

  ctx.globalAlpha = transition.alpha;
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#22c55e";
  ctx.fillText("TRANSFERRING...", canvas.width / 2, canvas.height / 2);

  ctx.restore();
}

// ---- HUD (top bar) ----
function drawHUD() {
  const op = gameState.operator;
  const roomName = ROOM_DISPLAY_NAMES[currentRoomKey] || currentRoomKey;

  ctx.save();
  ctx.fillStyle = "rgba(15,23,42,0.92)";
  ctx.fillRect(0, 0, canvas.width, 32);

  ctx.font = "12px monospace";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#e5e7eb";

  ctx.textAlign = "left";
  ctx.fillText(`Room: ${roomName}`, 8, 16);

  const roleDisplay = op.roleName
    ? `${op.roleName} (Lv ${op.level})`
    : "No role selected";
  ctx.textAlign = "center";
  ctx.fillText(`Role: ${roleDisplay}`, canvas.width / 2, 16);

  ctx.textAlign = "right";
  ctx.fillText(
    `Credits: ${op.credits}  Det: ${op.detection}%`,
    canvas.width - 8,
    16
  );

  ctx.restore();
}

// ---- Dialogue box (DOM overlay) ----
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
