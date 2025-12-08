// rooms.js
// Room definitions: tilemaps, spawn points, and interactive objects.
//
// Depends on:
//  - TILE_SIZE (from config.js)
// Produces:
//  - ROOM_DISPLAY_NAMES
//  - rooms.lobby

console.log("rooms.js loaded");

// Used by the HUD to display nicer names
const ROOM_DISPLAY_NAMES = {
  lobby: "Ops Hub Lobby",
};

// All rooms (we'll add more later)
const rooms = {
  lobby: makeLobbyRoom(),
};

// ---- LOBBY ROOM ----
// This is the main hub where you:
//  - pick a role (mentors in the center)
//  - accept a contract (console on the right)
//  - jack into the ROLE HUB terminal (bottom center) to run actions
function makeLobbyRoom() {
  // ----- TILEMAP -----
  // Simple 15x13 room:
  //  - 1 = wall
  //  - 0 = floor
  //
  // Feel free to replace this entire array with your own layout.
  const worldMap = [
    // 15 columns wide
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ];

  const objects = [];

  // Helper for tile→pixel
  const t = (n) => n * TILE_SIZE;

  // ----- ROLE MENTORS (center area) -----
  // Roughly middle row/columns; tweak to match your art.
  const mentorRow = 5;       // tile row
  const mentorStartCol = 4;  // where the left mentor starts

  objects.push(
    {
      type: "roleNpc",
      roleKey: "analyst",
      x: t(mentorStartCol),
      y: t(mentorRow),
      width: TILE_SIZE,
      height: TILE_SIZE,
      labelText: "ANALYST",
      labelColor: "#93c5fd",
      lines: [
        "Analyst: You specialize in intel and low-noise recon.",
        "You see patterns and weak spots before anyone else.",
        "Press E again if you want to lock in this role.",
      ],
    },
    {
      type: "roleNpc",
      roleKey: "operator",
      x: t(mentorStartCol + 2),
      y: t(mentorRow),
      width: TILE_SIZE,
      height: TILE_SIZE,
      labelText: "OPERATOR",
      labelColor: "#a7f3d0",
      lines: [
        "Operator: Flexible, balanced, and tactical.",
        "You can adapt to both tech-heavy and social missions.",
        "Press E again if you want to lock in this role.",
      ],
    },
    {
      type: "roleNpc",
      roleKey: "social",
      x: t(mentorStartCol + 4),
      y: t(mentorRow),
      width: TILE_SIZE,
      height: TILE_SIZE,
      labelText: "SOC. ENG.",
      labelColor: "#f9a8d4",
      lines: [
        "Social Engineer: People are your primary vector.",
        "You excel at phishing, pretexting, and human intel.",
        "Press E again if you want to lock in this role.",
      ],
    }
  );

  // ----- CONTRACTS CONSOLE (right side) -----
  objects.push({
    type: "terminalContract",
    x: t(11),
    y: t(3),
    width: TILE_SIZE,
    height: TILE_SIZE,
    labelText: "CONTRACTS",
    labelColor: "#38bdf8",
    lines: [
      "Contracts Console:",
      "Accept a baseline training mission here.",
      "Once active, plug into the ROLE HUB to run your actions.",
    ],
  });

  // ----- ROLE HUB TERMINAL (bottom center) -----
  // This is the green 'computer' that opens your terminal UI (terminalMode).
  objects.push({
    type: "terminalHub",
    x: t(7),
    y: t(9),
    width: TILE_SIZE,
    height: TILE_SIZE,
    labelText: "ROLE HUB",
    labelColor: "#22c55e",
    lines: [
      "ROLE HUB TERMINAL:",
      "Jack in to run Recon, Scan, Phish, Brute, Backdoor, and Exfil.",
      "Use ↑/↓ to select an action, then ENTER/E/SPACE to execute.",
    ],
  });

  // ----- DOORS (examples) -----
  // Later you can point these to 'training', 'ops', etc. Once those rooms exist.

  // Training door on bottom-left
  objects.push({
    type: "door",
    x: t(2),
    y: t(10),
    width: TILE_SIZE,
    height: TILE_SIZE,
    labelText: "TRAINING",
    targetRoom: "training", // this room doesn't exist yet; safe placeholder
    targetSpawn: { x: t(2), y: t(2) },
    lines: ["You move toward the training wing..."],
  });

  // Contracts briefing door bottom-right
  objects.push({
    type: "door",
    x: t(12),
    y: t(10),
    width: TILE_SIZE,
    height: TILE_SIZE,
    labelText: "OPS FLOOR",
    targetRoom: "opsFloor", // placeholder for a future room
    targetSpawn: { x: t(3), y: t(3) },
    lines: ["You head toward the operations floor..."],
  });

  return {
    worldMap,
    objects,
    // player spawn (bottom-ish center)
    spawn: {
      x: t(7),
      y: t(10),
    },
  };
}
