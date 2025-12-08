// state.js
// Global game state & input tracking.
// Depends on: TILE_SIZE (from config.js)

console.log("state.js loaded");

// Which room is currently active
let currentRoomKey = "lobby";

// Current tilemap and interactive objects for the active room
let worldMap = [];
let objects = [];

// Keyboard state
let keys = {};

// Core game state (player, operator stats, mission progress, dialogue)
const gameState = {
  player: {
    x: 0,
    y: 0,
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
