// map.js
// Tile + object definitions for the NetRunner Ops RPG

const TILE_SIZE = 32;

// 0 = floor, 1 = wall
// 15 tiles wide (15 * 32 = 480), 10 tiles high (10 * 32 = 320)
const worldMap = [
  // Row 0: top border wall
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

  // Room 3 (top): OPS / Hacking room (rows 1–2)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  // Row 3: wall separator between OPS and ROLE, doors at center (col 7)
  [1,1,1,1,1,1,1,0,1,1,1,1,1,1,1],

  // Room 2 (middle): ROLE / Training / Contracts (rows 4–5)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  // Row 6: wall separator between ROLE and LOBBY,
  // door near the right of the greeter (col 4)
  [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],

  // Room 1 (bottom): Lobby (rows 7–8)
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],

  // Row 9: bottom border wall
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Interactive objects in the world
// Coordinates are in pixels, aligned to tiles.
const objects = [
  // ---------- ROOM 1: LOBBY (bottom) ----------

  // Greeter in upper-left of the lobby
  {
    id: "greeter",
    type: "npc",
    x: 2 * TILE_SIZE,           // near left
    y: 7 * TILE_SIZE,           // upper part of lobby
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "yellow",
    lines: [
      "Welcome to NetRunner Ops.",
      "↑ Door on my right leads to the Role Hub.",
      "Choose a role, review training, then take on contracts."
    ]
  },

  // ---------- ROOM 2: ROLE / TRAINING / CONTRACTS (middle) ----------

  // Three role “terminals” in the center area
  {
    id: "bruteMentor",
    type: "roleNpc",
    roleKey: "brute",
    x: 4 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#f97316",
    lines: [
      "Brute Forcer: high TECH, lower STEALTH & SOCIAL.",
      "We go loud, hit hard, and crack things wide open.",
      "Interact with me to set your role to Brute Forcer."
    ]
  },
  {
    id: "socialMentor",
    type: "roleNpc",
    roleKey: "social",
    x: 7 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#a855f7",
    lines: [
      "Social Engineer: high SOCIAL & STEALTH, lower TECH.",
      "We manipulate humans in the training sim, not just systems.",
      "Interact with me to set your role to Social Engineer."
    ]
  },
  {
    id: "analystMentor",
    type: "roleNpc",
    roleKey: "analyst",
    x: 10 * TILE_SIZE,
    y: 4 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#22c55e",
    lines: [
      "Analyst: balanced STEALTH, TECH, and SOCIAL.",
      "We plan, recon, and adapt to the scenario.",
      "Interact with me to set your role to Analyst."
    ]
  },

  // Training terminal on the RIGHT side
  {
    id: "trainingTerminal",
    type: "npc",   // just shows dialogue for now
    x: 12 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#38bdf8",
    lines: [
      "TRAINING TERMINAL:",
      "Here you can review how roles, contracts, and ops work.",
      "In a future update this could walk you through a tutorial mission."
    ]
  },

  // Contracts area on the LEFT side
  {
    id: "contractTerminal",
    type: "terminalContract",
    x: 2 * TILE_SIZE,
    y: 5 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#38bdf8",
    lines: [
      "CONTRACTS CONSOLE:",
      "Browse and accept training contracts here.",
      "After accepting, go ↑ through the middle door to the Ops room."
    ]
  },

  // ---------- ROOM 3: OPS / HACKING ROOM (top) ----------

  // Action terminals in the OPS room
  {
    id: "reconTerminal",
    type: "terminalAction",
    action: "recon",
    x: 3 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Recon Terminal:",
      "Simulated high-level recon for intel gathering."
    ]
  },
  {
    id: "scanTerminal",
    type: "terminalAction",
    action: "scan",
    x: 5 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Scan Terminal:",
      "Run deeper technical scans in the sim."
    ]
  },
  {
    id: "phishTerminal",
    type: "terminalAction",
    action: "phish",
    x: 7 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Social Terminal:",
      "Simulated phishing and social engineering exercises."
    ]
  },
  {
    id: "bruteTerminal",
    type: "terminalAction",
    action: "brute",
    x: 9 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Brute Terminal:",
      "Aggressive, high-power simulated attacks."
    ]
  },
  {
    id: "backdoorTerminal",
    type: "terminalAction",
    action: "backdoor",
    x: 11 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Backdoor Terminal:",
      "Attempt to establish simulated persistence."
    ]
  },
  {
    id: "exfilTerminal",
    type: "terminalAction",
    action: "exfiltrate",
    x: 13 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Exfil Terminal:",
      "Attempt to complete the mission and exfiltrate simulated data."
    ]
  },
];