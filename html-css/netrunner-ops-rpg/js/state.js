// state.js
// Global state for NetRunner Ops RPG

console.log("state.js loaded");

// --- INPUT STATE ---
let keys = {};

// --- WORLD STATE ---
let worldMap = [];       // 2D array of tiles (set by loadRoom)
let objects = [];        // interactive objects in current room
let currentRoomKey = "lobby";

// --- GAME STATE (player, operator, contract, etc.) ---
const gameState = {
  player: {
    x: 7 * TILE_SIZE,
    y: 8 * TILE_SIZE,
    width: TILE_SIZE,
    height: TILE_SIZE,
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
