// map.js
// Tile + object definitions for the NetRunner Ops RPG

const TILE_SIZE = 32;

// 0 = floor, 1 = wall
// 15 tiles wide (15 * 32 = 480), 10 tiles high (10 * 32 = 320)
const worldMap = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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

// Interactive objects in the world
// Coordinates are in pixels, aligned to tiles.
const objects = [
  // Lobby greeter
  {
    id: "greeter",
    type: "npc",
    x: 2 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "yellow",
    lines: [
      "Welcome to NetRunner Ops.",
      "Walk right to meet the role mentors,",
      "then head further right to accept a contract."
    ]
  },

  // Role mentors
  {
    id: "bruteMentor",
    type: "roleNpc",
    roleKey: "brute",
    x: 5 * TILE_SIZE,
    y: 2 * TILE_SIZE,
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
    y: 2 * TILE_SIZE,
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
    x: 9 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#22c55e",
    lines: [
      "Analyst: balanced STEALTH, TECH, and SOCIAL.",
      "We plan, recon, and adapt to the scenario.",
      "Interact with me to set your role to Analyst."
    ]
  },

  // Contract terminal
  {
    id: "contractTerminal",
    type: "terminalContract",
    x: 11 * TILE_SIZE,
    y: 2 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#38bdf8",
    lines: [
      "Mission Console:",
      "Accept a training contract to begin a simulation.",
      "Interact to accept / see mission status."
    ]
  },

  // Action terminals (Ops area)
  {
    id: "reconTerminal",
    type: "terminalAction",
    action: "recon",
    x: 4 * TILE_SIZE,
    y: 5 * TILE_SIZE,
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
    x: 6 * TILE_SIZE,
    y: 5 * TILE_SIZE,
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
    x: 8 * TILE_SIZE,
    y: 5 * TILE_SIZE,
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
    x: 10 * TILE_SIZE,
    y: 5 * TILE_SIZE,
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
    x: 6 * TILE_SIZE,
    y: 6 * TILE_SIZE,
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
    x: 8 * TILE_SIZE,
    y: 6 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
    color: "#e5e7eb",
    lines: [
      "Exfil Terminal:",
      "Attempt to complete the mission and exfiltrate simulated data."
    ]
  },
];
