// interaction.js
// Handles finding nearby objects, prompts, and interactions in the world.
//
// Depends on globals: 
// - gameState, objects
// - ctx, canvas
// - showDialogue, setRole
// - handleContractConsole, performAction
// - startRoomTransition, enterTerminalMode

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  );
}

function getNearbyObject() {
  const p = gameState.player;
  const pxCenterX = p.x + p.width / 2;
  const pxCenterY = p.y + p.height / 2;

  let closest = null;
  let closestDist = Infinity;

  for (const obj of objects) {
    // If we're actually overlapping a DOOR tile, always prefer that
    if (
      obj.type === "door" &&
      rectsOverlap(
        p.x, p.y, p.width, p.height,
        obj.x, obj.y, obj.width, obj.height
      )
    ) {
      return obj;
    }

    const oxCenterX = obj.x + obj.width / 2;
    const oxCenterY = obj.y + obj.height / 2;
    const dist = Math.hypot(pxCenterX - oxCenterX, pxCenterY - oxCenterY);

    if (dist < 48 && dist < closestDist) {
      closest = obj;
      closestDist = dist;
    }
  }

  return closest;
}

function getInteractionPrompt(obj) {
  if (!obj) return "";

  if (obj.type === "npc") return "[E] Talk";
  if (obj.type === "roleNpc") return "[E] Talk: Mentor";
  if (obj.type === "terminalContract") return "[E] Use: Contracts Console";
  if (obj.type === "terminalHub") return "[E] Access Role Hub Terminal";

  if (obj.type === "terminalAction") {
    switch (obj.action) {
      case "recon":       return "[E] Run Recon";
      case "scan":        return "[E] Run Scan";
      case "phish":       return "[E] Run Social Attack";
      case "brute":       return "[E] Run Brute Force";
      case "backdoor":    return "[E] Establish Backdoor";
      case "exfiltrate":  return "[E] Attempt Exfiltration";
      default:            return "[E] Use Terminal";
    }
  }

  if (obj.type === "door") {
    const dest = obj.labelText || "Door";
    return `[SPACE] Enter: ${dest}`;
  }

  return "[E] Interact";
}

function drawInteractionHint() {
  const obj = getNearbyObject();
  if (!obj) return;

  const text = getInteractionPrompt(obj);
  if (!text) return;

  ctx.save();

  ctx.font = "12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const paddingX = 10;
  const textWidth = ctx.measureText(text).width;

  const boxWidth  = textWidth + paddingX * 2;
  const boxHeight = 22;
  const boxX = (canvas.width - boxWidth) / 2;
  const boxY = canvas.height - boxHeight - 8;

  ctx.fillStyle = "rgba(15,23,42,0.9)";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

  ctx.strokeStyle = "#22c55e";
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

  ctx.fillStyle = "#e5e7eb";
  ctx.fillText(text, canvas.width / 2, boxY + boxHeight / 2);

  ctx.restore();
}

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
    showDialogue(obj.lines);
    setTimeout(() => performAction(obj.action), 250);

  } else if (obj.type === "terminalHub") {
    // ROLE HUB → enter computer screen
    enterTerminalMode();

  } else if (obj.type === "door") {
    if (obj.targetRoom) {
      startRoomTransition(obj.targetRoom, obj.targetSpawn, obj.lines);
    }
  }
}