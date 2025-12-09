import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

console.log("Using API URL:", API_URL);

export default function App() {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState("");

  // Load token from localStorage on first render
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  async function handleAuthSubmit(e) {
    e.preventDefault();
    setStatus("Loading...");

    try {
      const res = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Request failed");
        return;
      }

      // data: { token, user: { id, email } }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setStatus(`${mode === "login" ? "Logged in" : "Registered"} successfully`);
    } catch (err) {
      console.error("Auth request failed", err);
      setStatus("Network error: ${err.message || err}");
    }
  }

  async function fetchMe() {
    if (!token) {
      setStatus("No token set. Please log in or register first.");
      return;
    }

    setStatus("Loading /api/me ...");

    try {
      const res = await fetch(`${API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Failed to fetch /api/me");
        return;
      }

      setStatus(`Protected route OK. User: ${data.user.email} (id: ${data.user.id})`);
    } catch (err) {
      console.error("Fetch /api/me failed", err);
      setStatus("Network error calling /api/me: ${err.message || err}");
    }
  }

  function handleLogout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setStatus("Logged out");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#e5e7eb",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#020617",
          borderRadius: "16px",
          padding: "24px 28px",
          boxShadow: "0 20px 45px rgba(0,0,0,0.45)",
          border: "1px solid #1f2937",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Budget App Auth
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
          {mode === "login"
            ? "Log in to access your budget dashboard."
            : "Create an account to start tracking your finances."}
        </p>

        {/* Mode switcher */}
        <div
          style={{
            display: "flex",
            marginBottom: "1.5rem",
            background: "#020617",
            borderRadius: "999px",
            border: "1px solid #1f2937",
            padding: "2px",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("login")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              background: mode === "login" ? "#e5e7eb" : "transparent",
              color: mode === "login" ? "#020617" : "#9ca3af",
              fontWeight: mode === "login" ? 600 : 400,
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
              background: mode === "register" ? "#e5e7eb" : "transparent",
              color: mode === "register" ? "#020617" : "#9ca3af",
              fontWeight: mode === "register" ? 600 : 400,
            }}
          >
            Register
          </button>
        </div>

        {/* Auth form */}
        <form onSubmit={handleAuthSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ fontSize: "0.85rem" }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <label style={{ fontSize: "0.85rem" }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              style={{
                width: "100%",
                marginTop: "4px",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #4b5563",
                background: "#020617",
                color: "#e5e7eb",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "4px",
              width: "100%",
              padding: "10px 0",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, rgba(56,189,248,1), rgba(59,130,246,1))",
              color: "#020617",
            }}
          >
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </form>

        {/* Status message */}
        {status && (
          <p
            style={{
              marginTop: "12px",
              fontSize: "0.8rem",
              color: "#e5e7eb",
              minHeight: "1.5em",
            }}
          >
            {status}
          </p>
        )}

        {/* Logged-in panel */}
        <div
          style={{
            marginTop: "16px",
            paddingTop: "12px",
            borderTop: "1px solid #1f2937",
            fontSize: "0.85rem",
          }}
        >
          <h2 style={{ fontSize: "0.95rem", marginBottom: "8px" }}>Session</h2>
          {user ? (
            <>
              <p style={{ marginBottom: "4px" }}>
                <strong>User:</strong> {user.email} (id: {user.id})
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  onClick={fetchMe}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "999px",
                    border: "1px solid #4b5563",
                    background: "transparent",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Test /api/me
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    flex: 1,
                    padding: "6px 0",
                    borderRadius: "999px",
                    border: "1px solid #b91c1c",
                    background: "transparent",
                    color: "#fecaca",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                  }}
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <p style={{ color: "#9ca3af" }}>
              Not logged in. Use the form above to log in or register.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
