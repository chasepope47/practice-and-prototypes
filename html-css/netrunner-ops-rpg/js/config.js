// config.js
// Shared constants + simple data for NetRunner Ops RPG

// World
const TILE_SIZE = 32;

// Display names for the HUD
const ROOM_DISPLAY_NAMES = {
  lobby: "Lobby",
  training: "Training Wing",
  contracts: "Contracts Hall",
  opsFloor: "Ops Floor",
  roleHub: "Role Hub",
  ops: "Operations",
};

// Role definitions used by setRole()
const ROLE_DEFS = {
  brute: {
    name: "Brute Forcer",
    stealth: 2,
    tech: 5,
    social: 2,
  },
  social: {
    name: "Social Engineer",
    stealth: 4,
    tech: 2,
    social: 5,
  },
  analyst: {
    name: "Analyst",
    stealth: 3,
    tech: 4,
    social: 3,
  },
};
