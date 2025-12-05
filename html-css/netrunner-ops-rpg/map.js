// map.js
// Multi-room layout for NetRunner Ops RPG

const TILE_SIZE = 32;

// Helper: basic 15x10 empty room (walls around, floor inside)
function createEmptyRoom() {
  return [
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
}

const rooms = {
  // ---------- ROOM 1: LOBBY ----------
  lobby: {
    worldMap: createEmptyRoom(),
    spawn: {
      x: 7 * TILE_SIZE,
      y: 8 * TILE_SIZE, // middle-bottom of room
    },
    objects: [
      // Greeter in upper-left of lobby
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
          "Door on my right leads to the Role Hub.",
          "Head there to choose a role and review training."
        ],
      },
      // Door from Lobby -> Role Hub (to the right of greeter)
      {
        id: "doorLobbyToRole",
        type: "door",
        x: 4 * TILE_SIZE,
        y: 2 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        targetRoom: "roleHub",
        targetSpawn: {
          x: 7 * TILE_SIZE,
          y: 8 * TILE_SIZE, // enter at bottom of role room
        },
        lines: ["You step through the door into the Role Hub..."],
      },
    ],
  },

  // ---------- ROOM 2: ROLE / TRAINING / CONTRACTS ----------
  roleHub: {
    worldMap: createEmptyRoom(),
    spawn: {
      x: 7 * TILE_SIZE,
      y: 8 * TILE_SIZE,
    },
    objects: [
      // Role mentors in the center row
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
        ],
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
        ],
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
        ],
      },

      // Training terminal on the RIGHT side
      {
        id: "trainingTerminal",
        type: "npc",
        x: 12 * TILE_SIZE,
        y: 5 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#38bdf8",
        lines: [
          "TRAINING TERMINAL:",
          "Review how roles, contracts, and ops work.",
          "In a future update this could be a guided tutorial."
        ],
      },

      // Contracts terminal on the LEFT side
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
          "After accepting, go through the top door to reach Ops."
        ],
      },

      // Door back to Lobby (near bottom center)
      {
        id: "doorRoleToLobby",
        type: "door",
        x: 7 * TILE_SIZE,
        y: 8 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        targetRoom: "lobby",
        targetSpawn: {
          x: 7 * TILE_SIZE,
          y: 8 * TILE_SIZE,
        },
        lines: ["You return to the Lobby."],
      },

      // Door to Ops at the top middle
      {
        id: "doorRoleToOps",
        type: "door",
        x: 7 * TILE_SIZE,
        y: 1 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        targetRoom: "ops",
        targetSpawn: {
          x: 7 * TILE_SIZE,
          y: 8 * TILE_SIZE,
        },
        lines: ["You step into the Operations room..."],
      },
    ],
  },

  // ---------- ROOM 3: OPS / HACKING ----------
  ops: {
    worldMap: createEmptyRoom(),
    spawn: {
      x: 7 * TILE_SIZE,
      y: 8 * TILE_SIZE,
    },
    objects: [
      // Door back to Role Hub at bottom middle
      {
        id: "doorOpsToRole",
        type: "door",
        x: 7 * TILE_SIZE,
        y: 8 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        targetRoom: "roleHub",
        targetSpawn: {
          x: 7 * TILE_SIZE,
          y: 1 * TILE_SIZE,
        },
        lines: ["You return to the Role Hub."],
      },

      // Action terminals in a row near the top
      {
        id: "reconTerminal",
        type: "terminalAction",
        action: "recon",
        x: 3 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Recon Terminal:",
          "Simulated high-level recon for intel gathering."
        ],
      },
      {
        id: "scanTerminal",
        type: "terminalAction",
        action: "scan",
        x: 5 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Scan Terminal:",
          "Run deeper technical scans in the sim."
        ],
      },
      {
        id: "phishTerminal",
        type: "terminalAction",
        action: "phish",
        x: 7 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Social Terminal:",
          "Simulated phishing and social engineering exercises."
        ],
      },
      {
        id: "bruteTerminal",
        type: "terminalAction",
        action: "brute",
        x: 9 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Brute Terminal:",
          "Aggressive, high-power simulated attacks."
        ],
      },
      {
        id: "backdoorTerminal",
        type: "terminalAction",
        action: "backdoor",
        x: 11 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Backdoor Terminal:",
          "Attempt to establish simulated persistence."
        ],
      },
      {
        id: "exfilTerminal",
        type: "terminalAction",
        action: "exfiltrate",
        x: 13 * TILE_SIZE,
        y: 3 * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        color: "#e5e7eb",
        lines: [
          "Exfil Terminal:",
          "Attempt to complete the mission and exfiltrate simulated data."
        ],
      },
    ],
  },
};

// These are what game.js uses; loadRoom() will swap them out.
let worldMap = rooms.lobby.worldMap;
let objects = rooms.lobby.objects;
