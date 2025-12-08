// state.js
// Shared global game state and helper values.
//
// Loaded after config.js and before rooms/player/mission/...
//
// Depends on:
//  - TILE_SIZE (from config.js)

console.log("state.js loaded");

// current room id (matches keys in rooms.js)
let currentRoomKey = "lobby";

// tile map + interactive objects for the current room
let worldMap = [];
let objects = [];

// keyboard state
let keys = {};

// core game state
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

// simple helper for mission rolls
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
