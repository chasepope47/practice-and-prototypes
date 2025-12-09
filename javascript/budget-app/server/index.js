// server/index.js
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-dev-key"; // change this later

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DB SETUP (SQLite) ---
const dbPath = path.join(__dirname, "budget-auth.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
  `);
});

// --- AUTH MIDDLEWARE (for later protected routes) ---
function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// --- REGISTER ---
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const stmt = db.prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)");
    stmt.run(email, passwordHash, function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(409).json({ error: "Email already in use" });
        }
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      const userId = this.lastID;
      const token = jwt.sign({ id: userId, email }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ token, user: { id: userId, email } });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// --- LOGIN ---
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ token, user: { id: user.id, email: user.email } });
  });
});

// simple test route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Budget auth API is running" });
});

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Auth API running on http://localhost:${PORT}`);
});
