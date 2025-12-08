// terminal.js
// ROLE HUB "computer" screen logic

// depends on: gameState, performAction (from mission.js), ctx, canvas

let terminalMode = false;
let terminalSelection = 0;
let terminalMessage = "";

const terminalMenuItems = [
  { id: "recon",      label: "Run Recon" },
  { id: "scan",       label: "Run Scan" },
  { id: "phish",      label: "Run Social Attack" },
  { id: "brute",      label: "Run Brute Force" },
  { id: "backdoor",   label: "Establish Backdoor" },
  { id: "exfiltrate", label: "Attempt Exfiltration" },
  { id: "exit",       label: "Log Out" },
];

function enterTerminalMode() {
  terminalMode = true;
  terminalSelection = 0;
  terminalMessage = "";
}

function exitTerminalMode() {
  terminalMode = false;
}

function handleTerminalKey(e) {
  if (e.key === "Escape") {
    exitTerminalMode();
    return;
  }

  if (e.key === "ArrowUp") {
    terminalSelection =
      (terminalSelection - 1 + terminalMenuItems.length) %
      terminalMenuItems.length;
  } else if (e.key === "ArrowDown") {
    terminalSelection = (terminalSelection + 1) % terminalMenuItems.length;
  } else if (
    e.key === "Enter" ||
    e.key === "e" ||
    e.key === "E" ||
    e.key === " "
  ) {
    const item = terminalMenuItems[terminalSelection];
    runTerminalAction(item.id);
  }
}

function runTerminalAction(id) {
  if (id === "exit") {
    exitTerminalMode();
    return;
  }

  performAction(id); // uses your existing mission logic
}

function drawTerminalUI() {
  ctx.save();

  // dark overlay
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "#020617";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  // header
  ctx.font = "18px monospace";
  ctx.fillStyle = "#22c55e";
  ctx.textAlign = "left";
  ctx.fillText("ROLE HUB TERMINAL // OPS CONSOLE", 24, 48);

  // menu
  ctx.font = "14px monospace";
  terminalMenuItems.forEach((item, i) => {
    const y = 100 + i * 26;
    const selected = i === terminalSelection;

    if (selected) {
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(16, y - 18, 260, 24);
      ctx.fillStyle = "#020617";
    } else {
      ctx.fillStyle = "#e5e7eb";
    }

    ctx.fillText(item.label, 24, y);
  });

  // contract info
  const c = gameState.contract;
  ctx.textAlign = "left";
  ctx.font = "12px monospace";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText("ACTIVE CONTRACT", 320, 100);

  ctx.fillStyle = "#e5e7eb";
  if (c && c.active) {
    ctx.fillText(`Name: ${c.name}`, 320, 124);
    ctx.fillText(`Difficulty: ${c.difficulty}`, 320, 144);
    ctx.fillText(`Base Reward: ${c.baseReward} cr`, 320, 164);
  } else {
    ctx.fillText("None. Use mission console to accept.", 320, 124);
  }

  // footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(
    "[↑/↓] Move  [ENTER/E/SPACE] Execute  [ESC] Exit",
    canvas.width / 2,
    canvas.height - 24
  );

  ctx.restore();
}
