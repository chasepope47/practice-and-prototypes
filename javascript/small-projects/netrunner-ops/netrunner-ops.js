// NetRunner Ops
// A text-based cyber-ops simulation game for Node.js
// Purely fictional, for entertainment & practice only.

const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------- PLAYER / GAME STATE ----------

class Player {
  constructor(handle, roleKey) {
    this.handle = handle;
    this.roleKey = roleKey;

    const roles = {
      brute: {
        name: "Brute Forcer",
        stealth: 2,
        tech: 5,
        social: 2,
        description: "Specialist in loud but powerful attacks.",
      },
      social: {
        name: "Social Engineer",
        stealth: 4,
        tech: 2,
        social: 5,
        description: "Master of deception and persuasion.",
      },
      analyst: {
        name: "Analyst",
        stealth: 3,
        tech: 4,
        social: 3,
        description: "Balanced operator with strong recon & planning.",
      },
    };

    this.role = roles[roleKey];
    this.stealth = this.role.stealth;
    this.tech = this.role.tech;
    this.social = this.role.social;

    this.xp = 0;
    this.credits = 0;
    this.level = 1;

    this.detection = 0; // 0 - 100
    this.activeIntel = {
      recon: false,
      scan: false,
      credentialEdge: false,
      backdoor: false,
    };
  }

  addXP(amount) {
    this.xp += amount;
    const neededForNext = this.level * 50;
    if (this.xp >= neededForNext) {
      this.level++;
      this.xp -= neededForNext;
      this.levelUp();
    }
  }

  levelUp() {
    console.log("\n⬆️  LEVEL UP! Your skills improve.");
    this.stealth++;
    this.tech++;
    this.social++;
    console.log(
      `New stats → Stealth: ${this.stealth}, Tech: ${this.tech}, Social: ${this.social}`
    );
  }

  addCredits(amount) {
    this.credits += amount;
  }

  adjustDetection(amount) {
    this.detection = Math.max(0, Math.min(100, this.detection + amount));
  }

  resetMissionState() {
    this.detection = 0;
    this.activeIntel = {
      recon: false,
      scan: false,
      credentialEdge: false,
      backdoor: false,
    };
  }
}

function createMissions() {
  return [
    {
      id: 1,
      name: "Local Startup Test",
      difficulty: 1,
      baseReward: 50,
      description:
        "A small startup wants you to test their basic defenses. Low stakes, good warm-up.",
    },
    {
      id: 2,
      name: "Regional Retail Chain Audit",
      difficulty: 2,
      baseReward: 100,
      description:
        "You’ve been contracted to evaluate a mid-sized retailer’s online systems.",
    },
    {
      id: 3,
      name: "Cloud Infrastructure Simulation",
      difficulty: 3,
      baseReward: 200,
      description:
        "A simulated environment representing a large organization’s cloud infrastructure.",
    },
  ];
}

// ---------- CORE GAME LOGIC ----------

async function chooseRole() {
  console.log("\nChoose your role:");
  console.log("1) Brute Forcer  – High tech, low stealth/social");
  console.log("2) Social Engineer – High social, high stealth");
  console.log("3) Analyst – Balanced, good recon");

  while (true) {
    const choice = await ask("Chose your role (1 = Brute Forcer, 2 = Social Engineer, 3 = Analyst): ");
    if (choice === "1") return "brute";
    if (choice === "2") return "social";
    if (choice === "3") return "analyst";
    console.log("Invalid choice, try again.");
  }
}

async function chooseMission(missions) {
  console.log("\n📂 Available Missions:");
  missions.forEach((m) => {
    console.log(
      `\n[${m.id}] ${m.name}\n  Difficulty: ${m.difficulty}\n  Reward: ${m.baseReward} credits\n  ${m.description}`
    );
  });

  while (true) {
    const raw = await ask("\nEnter mission number or 'q' to quit: ");
    if (raw.toLowerCase() === "q") return null;
    const num = Number(raw);
    const mission = missions.find((m) => m.id === num);
    if (mission) return mission;
    console.log("Invalid mission, try again.");
  }
}

function printStatus(player, mission) {
  console.log("\n--------- STATUS ---------");
  console.log(`Operator: ${player.handle} (Lvl ${player.level} – ${player.role.name})`);
  console.log(`Mission:  ${mission.name}`);
  console.log(`Credits:  ${player.credits}  | XP: ${player.xp}`);
  console.log(`Stealth:  ${player.stealth}  Tech: ${player.tech}  Social: ${player.social}`);
  console.log(`Detection: ${player.detection}/100`);
  console.log("Intel:");
  console.log(
    `  Recon: ${player.activeIntel.recon ? "✅" : "❌"}, ` +
      `Scan: ${player.activeIntel.scan ? "✅" : "❌"}, ` +
      `Cred Edge: ${player.activeIntel.credentialEdge ? "✅" : "❌"}, ` +
      `Backdoor: ${player.activeIntel.backdoor ? "✅" : "❌"}`
  );
  console.log("--------------------------\n");
}

function missionActionMenu() {
  console.log("Choose your action:");
  console.log("1) Recon       – Low risk, reveals basics, helps later");
  console.log("2) Scan        – Technical scan, more intel, more risk");
  console.log("3) Phish       – Try to trick a user, uses social skill");
  console.log("4) Brute       – Aggressive attack, high tech, high risk");
  console.log("5) Backdoor    – Try to establish persistent access");
  console.log("6) Exfiltrate  – Attempt to complete the mission");
  console.log("7) Abort       – Bail out to avoid detection");
}

async function missionTurn(player, mission) {
  missionActionMenu();
  const choice = await ask("Action (1-7): ");

  switch (choice) {
    case "1":
      return doRecon(player, mission);
    case "2":
      return doScan(player, mission);
    case "3":
      return doPhish(player, mission);
    case "4":
      return doBrute(player, mission);
    case "5":
      return doBackdoor(player, mission);
    case "6":
      return doExfiltrate(player, mission);
    case "7":
      console.log("\n🛑 You abort the mission and quietly disengage.");
      return { missionOver: true, success: false, aborted: true };
    default:
      console.log("\nInvalid choice. You hesitate and lose precious time...");
      player.adjustDetection(5);
      return { missionOver: false };
  }
}

// ---------- ACTION HANDLERS ----------

function doRecon(player, mission) {
  console.log("\n📡 You perform high-level recon on the target...");
  const baseChance = 70 + player.stealth * 3;
  const roll = randomBetween(1, 100);

  if (roll <= baseChance) {
    console.log("✅ Recon successful. You map basic infrastructure and spot weak points.");
    player.activeIntel.recon = true;
    player.adjustDetection(2);
    player.addXP(5 * mission.difficulty);
  } else {
    console.log("⚠️ Recon yielded little useful info and raised some minor suspicion.");
    player.adjustDetection(8);
  }

  return { missionOver: false };
}

function doScan(player, mission) {
  console.log("\n🛰️ You launch a deeper technical scan...");
  let baseChance = 60 + player.tech * 3;
  if (player.activeIntel.recon) baseChance += 10;

  const roll = randomBetween(1, 100);

  if (roll <= baseChance) {
    console.log("✅ Scan successful. You identify potential misconfigurations.");
    player.activeIntel.scan = true;
    player.adjustDetection(10);
    player.addXP(8 * mission.difficulty);
  } else {
    console.log("🚨 Scan was noisy. Monitoring systems are now on alert.");
    player.adjustDetection(20);
  }

  return { missionOver: false };
}

function doPhish(player, mission) {
  console.log("\n✉️  You craft a believable message and send it to a user...");
  let baseChance = 50 + player.social * 4;
  if (player.activeIntel.recon) baseChance += 5;

  const roll = randomBetween(1, 100);

  if (roll <= baseChance) {
    console.log(
      "✅ A simulated user clicked the link and entered credentials in your training portal."
    );
    player.activeIntel.credentialEdge = true;
    player.adjustDetection(8);
    player.addXP(10 * mission.difficulty);
  } else {
    console.log(
      "⚠️ The simulated user reported the message. Security teams are a bit more alert."
    );
    player.adjustDetection(15);
  }

  return { missionOver: false };
}

function doBrute(player, mission) {
  console.log("\n💥 You initiate a direct, aggressive attack path...");
  let baseChance = 40 + player.tech * 4;
  if (player.activeIntel.scan) baseChance += 10;
  if (player.activeIntel.credentialEdge) baseChance += 10;

  const roll = randomBetween(1, 100);

  if (roll <= baseChance) {
    console.log(
      "✅ Your simulated brute-force strategy identifies a weak control that can be exploited."
    );
    player.activeIntel.backdoor = true;
    player.adjustDetection(20);
    player.addXP(12 * mission.difficulty);
  } else {
    console.log("🚨 The target logs show clear attack patterns. Detection risk spikes.");
    player.adjustDetection(30);
  }

  return { missionOver: false };
}

function doBackdoor(player, mission) {
  console.log("\n🔑 You attempt to establish a persistent foothold (simulated)...");
  let baseChance = 45 + player.tech * 3 + player.stealth * 2;
  if (player.activeIntel.scan) baseChance += 10;
  if (player.activeIntel.credentialEdge) baseChance += 10;

  const roll = randomBetween(1, 100);

  if (roll <= baseChance) {
    console.log("✅ Backdoor established in the training environment. Future actions are safer.");
    player.activeIntel.backdoor = true;
    player.adjustDetection(15);
    player.addXP(15 * mission.difficulty);
  } else {
    console.log(
      "🚨 Logging tools detect suspicious persistence attempts. Defenders tighten monitoring."
    );
    player.adjustDetection(25);
  }

  return { missionOver: false };
}

function doExfiltrate(player, mission) {
  console.log("\n📦 You attempt to complete the mission objectives and exfiltrate simulated data...");

  // Base chance depends on difficulty & skills
  let baseChance = 30 + player.tech * 3 + player.stealth * 2;

  if (player.activeIntel.recon) baseChance += 5;
  if (player.activeIntel.scan) baseChance += 10;
  if (player.activeIntel.credentialEdge) baseChance += 10;
  if (player.activeIntel.backdoor) baseChance += 10;

  // Detection makes things harder
  baseChance -= Math.floor(player.detection / 3);

  const roll = randomBetween(1, 100);
  console.log(`\n(Your success roll: ${roll}, needed ≤ ${baseChance} to succeed)`);

  if (roll <= baseChance) {
    console.log("✅ MISSION SUCCESS: You complete the objectives within the simulation.");
    const reward = mission.baseReward + randomBetween(0, 30);
    console.log(`You earn ${reward} credits.`);
    player.addCredits(reward);
    player.addXP(25 * mission.difficulty);
    return { missionOver: true, success: true, aborted: false };
  } else {
    console.log(
      "🚨 MISSION FAILED: Defensive systems detected irregular activity before you could finish."
    );
    player.adjustDetection(30);
    return { missionOver: true, success: false, aborted: false };
  }
}

// ---------- MAIN GAME LOOP ----------

async function playMission(player, mission) {
  console.clear();
  console.log("=========================================");
  console.log("           🧬 NetRunner Ops 🧬");
  console.log("=========================================");
  console.log(`Mission: ${mission.name}`);
  console.log(mission.description);
  console.log("=========================================\n");

  player.resetMissionState();

  let missionOver = false;
  let result = { missionOver: false };

  while (!missionOver) {
    if (player.detection >= 100) {
      console.log(
        "\n🚨 FULL DETECTION: The training environment triggers a complete lockout scenario."
      );
      console.log("Mission flagged as failed in the simulation.");
      return { success: false, aborted: false };
    }

    printStatus(player, mission);
    result = await missionTurn(player, mission);
    missionOver = result.missionOver;
  }

  return { success: result.success, aborted: result.aborted };
}

async function main() {
  console.clear();
  console.log("=========================================");
  console.log("           🧬 NetRunner Ops 🧬");
  console.log("=========================================");
  console.log("A purely fictional cyber-ops training sim for your terminal.\n");

  console.log("Available Roles:");
  console.log("1) Brute Forcer");
  console.log("   • High TECH, lower STEALTH & SOCIAL.");
  console.log("   • Excels at aggressive, direct attacks (Brute, Scan).");
  console.log("   • Best if you like high-risk, high-reward plays.\n");

  console.log("2) Social Engineer");
  console.log("   • High SOCIAL and STEALTH, lower TECH.");
  console.log("   • Strong at phishing and deception-based actions (Phish).");
  console.log("   • Great if you like manipulating people in the sim instead of systems.\n");

  console.log("3) Analyst");
  console.log("   • Balanced STEALTH, TECH, and SOCIAL.");
  console.log("   • Very good at recon and planning (Recon, Scan, Backdoor).");
  console.log("   • Ideal if you want flexibility and safer, informed decisions.\n");

  await ask("Press Enter to begin creating your operator...");

  const handle = await ask("\nChoose your operator handle: ");
  const roleKey = await chooseRole();
  const player = new Player(handle || "Operator", roleKey);

  console.log(
    `\nWelcome, ${player.handle} the ${player.role.name}.\n${player.role.description}\n`
  );

  const missions = createMissions();

  gameLoop: while (true) {
    console.log("\n================= MAIN MENU =================");
    console.log("1) Take a mission");
    console.log("2) View profile");
    console.log("3) Exit");
    const choice = await ask("Select an option: ");

    if (choice === "1") {
      const mission = await chooseMission(missions);
      if (!mission) {
        console.log("Exiting game...");
        break gameLoop;
      }

      const { success, aborted } = await playMission(player, mission);
      if (aborted) {
        console.log("\nMission ended with no reward, but you learned from the attempt.");
        player.addXP(5 * mission.difficulty);
      } else if (success) {
        console.log("\nGreat work. The client is pleased with the training results.");
      } else {
        console.log("\nMission failed in simulation, but the lessons are valuable.");
        player.addXP(10 * mission.difficulty);
      }
    } else if (choice === "2") {
      console.log("\n----- PROFILE -----");
      console.log(`Handle: ${player.handle}`);
      console.log(`Role:   ${player.role.name}`);
      console.log(`Level:  ${player.level}`);
      console.log(`XP:     ${player.xp}`);
      console.log(`Credits:${player.credits}`);
      console.log(
        `Stats → Stealth: ${player.stealth}, Tech: ${player.tech}, Social: ${player.social}`
      );
      console.log("-------------------");
    } else if (choice === "3") {
      console.log("\nGoodbye, operator. Simulation ended.");
      break gameLoop;
    } else {
      console.log("Invalid menu option.");
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  rl.close();
});