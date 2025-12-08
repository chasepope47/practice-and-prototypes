// missions.js
// Role selection, detection, XP, credits, and mission actions.
//
// Depends on globals:
// - gameState (player/operator/contract)
// - ROLE_DEFS (role definitions)
// - randomBetween(min, max)
// - showDialogue()

// ---- Role selection ----
function setRole(roleKey) {
  const op = gameState.operator;
  const role = ROLE_DEFS[roleKey];
  if (!role) return;

  op.roleKey = roleKey;
  op.roleName = role.name;
  op.stealth = role.stealth;
  op.tech = role.tech;
  op.social = role.social;

  showDialogue([
    `Role set to ${role.name}.`,
    `Stats → Stealth ${op.stealth}, Tech ${op.tech}, Social ${op.social}.`,
    "Now head to the mission console on the right to accept a contract.",
  ]);
}

// ---- Detection / XP / credits helpers ----
function adjustDetection(amount) {
  const op = gameState.operator;
  op.detection = Math.max(0, Math.min(100, op.detection + amount));
}

function addXP(amount) {
  const op = gameState.operator;
  op.xp += amount;
  const needed = op.level * 50;
  if (op.xp >= needed) {
    op.level++;
    op.xp -= needed;
    op.stealth++;
    op.tech++;
    op.social++;
    showDialogue([
      "LEVEL UP!",
      `You reach level ${op.level}.`,
      `Your skills improve → Stealth ${op.stealth}, Tech ${op.tech}, Social ${op.social}.`,
    ]);
  }
}

function addCredits(amount) {
  const op = gameState.operator;
  op.credits += amount;
}

function resetIntelAndDetection() {
  const op = gameState.operator;
  op.detection = 0;
  op.intel = {
    recon: false,
    scan: false,
    credentialEdge: false,
    backdoor: false,
  };
}

function requireRoleAndContract(forAction = false) {
  const op = gameState.operator;
  if (!op.roleKey) {
    showDialogue([
      "You haven't chosen a role yet.",
      "Talk to one of the mentors in the center area to set your role.",
    ]);
    return false;
  }
  if (forAction && !gameState.contract.active) {
    showDialogue([
      "No active contract.",
      "Use the mission console on the right to accept a training contract first.",
    ]);
    return false;
  }
  return true;
}

// ---- Main mission action handler ----
function performAction(action) {
  const op = gameState.operator;
  const c = gameState.contract;

  if (!requireRoleAndContract(true)) return;

  if (action === "recon") {
    let baseChance = 70 + op.stealth * 3;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.recon = true;
      adjustDetection(2);
      addXP(5 * c.difficulty);
      showDialogue([
        "Recon successful.",
        "You map infrastructure and spot weak points.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(8);
      showDialogue([
        "Recon attempt yielded little intel and raised some suspicion.",
        `Detection: ${op.detection}/100`,
      ]);
    }

  } else if (action === "scan") {
    let baseChance = 60 + op.tech * 3;
    if (op.intel.recon) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.scan = true;
      adjustDetection(10);
      addXP(8 * c.difficulty);
      showDialogue([
        "Scan successful.",
        "You identify misconfigurations in the simulated environment.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(20);
      showDialogue([
        "Scan is noisy and triggers increased monitoring in the sim.",
        `Detection: ${op.detection}/100`,
      ]);
    }

  } else if (action === "phish") {
    let baseChance = 50 + op.social * 4;
    if (op.intel.recon) baseChance += 5;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.credentialEdge = true;
      adjustDetection(8);
      addXP(10 * c.difficulty);
      showDialogue([
        "Simulated user falls for your phishing scenario.",
        "Training portal logs credentials for review.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(15);
      showDialogue([
        "Simulated user reports your message. Security tightens.",
        `Detection: ${op.detection}/100`,
      ]);
    }

  } else if (action === "brute") {
    let baseChance = 40 + op.tech * 4;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.backdoor = true;
      adjustDetection(20);
      addXP(12 * c.difficulty);
      showDialogue([
        "Aggressive simulated brute-force discloses a weak control.",
        "A training backdoor route becomes available.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(30);
      showDialogue([
        "Defensive logs show clear brute-force patterns.",
        "The training environment treats you as noisy.",
        `Detection: ${op.detection}/100`,
      ]);
    }

  } else if (action === "backdoor") {
    let baseChance = 45 + op.tech * 3 + op.stealth * 2;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      op.intel.backdoor = true;
      adjustDetection(15);
      addXP(15 * c.difficulty);
      showDialogue([
        "Backdoor established in the simulated environment.",
        "Future actions become more forgiving.",
        `Detection: ${op.detection}/100`,
      ]);
    } else {
      adjustDetection(25);
      showDialogue([
        "Persistence attempts are flagged in training logs.",
        "Defensive systems heighten their response.",
        `Detection: ${op.detection}/100`,
      ]);
    }

  } else if (action === "exfiltrate") {
    let baseChance = 30 + op.tech * 3 + op.stealth * 2;
    if (op.intel.recon) baseChance += 5;
    if (op.intel.scan) baseChance += 10;
    if (op.intel.credentialEdge) baseChance += 10;
    if (op.intel.backdoor) baseChance += 10;

    baseChance -= Math.floor(op.detection / 3);
    const roll = randomBetween(1, 100);

    if (roll <= baseChance) {
      const reward = c.baseReward + randomBetween(0, 30);
      addCredits(reward);
      addXP(25 * c.difficulty);
      showDialogue([
        "MISSION SUCCESS:",
        "You complete the training objectives and exfiltrate simulated data.",
        `Reward: ${reward} credits.`,
        `Total credits: ${op.credits}.`,
      ]);
      gameState.contract.active = false;
      resetIntelAndDetection();
    } else {
      adjustDetection(30);
      addXP(10 * c.difficulty);
      showDialogue([
        "MISSION FAILED:",
        "The training environment detects your activity before completion.",
        `Detection: ${op.detection}/100`,
      ]);
      gameState.contract.active = false;
      resetIntelAndDetection();
    }
  }

  if (gameState.operator.detection >= 100) {
    showDialogue([
      "FULL DETECTION:",
      "The simulation triggers a complete lockout.",
      "Your detection resets for the next run.",
    ]);
    resetIntelAndDetection();
    gameState.contract.active = false;
  }
}

// ---- Contract console (accept / info) ----
function handleContractConsole() {
  if (!requireRoleAndContract(false)) return;
  const op = gameState.operator;
  const c = gameState.contract;

  if (!gameState.contract.active) {
    gameState.contract.active = true;
    resetIntelAndDetection();
    showDialogue([
      "Training contract accepted:",
      `"${c.name}" (Difficulty ${c.difficulty}).`,
      "Use the terminals below to perform actions.",
      "Finish at the Exfil terminal to try to complete the mission.",
      `Current credits: ${op.credits}.`,
    ]);
  } else {
    showDialogue([
      "You already have an active contract.",
      "Use action terminals in the lower area or finish at the Exfil terminal.",
      `Detection: ${op.detection}/100`,
    ]);
  }
}
