# 🧬 NetRunner Ops

A text-based *fictional* cyber-ops simulation game for the terminal, written in JavaScript (Node.js).

You play as a simulated operator who:

- Chooses a **handle** and **role**  
- Takes on multiple **missions** with different difficulty and rewards  
- Picks from actions like:
  - `Recon` – gather intel with low risk  
  - `Scan` – deeper technical intel, higher risk  
  - `Phish` – social route using your social stat  
  - `Brute` – aggressive simulated attack  
  - `Backdoor` – establish persistent simulated access  
  - `Exfiltrate` – attempt to complete the mission  
  - `Abort` – bail out before detection  

Behind the scenes:

- You have stats: **Stealth**, **Tech**, **Social**
- A **Detection** meter tracks how close you are to being caught in the simulation
- Your choices and stats influence success chances and risk

> ⚠️ This is a purely fictional game for entertainment and practice only.  
> It does **not** perform any real network activity.

---

## 🚀 How to Run

1. Ensure you have [Node.js](https://nodejs.org/) installed.

2. From your project root, navigate to the game folder:

   ```bash
   cd javascript/small-projects/netrunner-ops