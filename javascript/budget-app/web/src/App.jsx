// web/src/App.jsx
import { useState, useEffect } from "react";

const API_URL = "http://localhost:4000/api";

function App() {
  const [token, setToken] = useState(null);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [transactions, setTransactions] = useState([]);
  const [newTx, setNewTx] = useState({
    amount: "",
    type: "expense",
    category: "",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const register = async () => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    const data = await res.json();
    if (res.ok) setToken(data.token);
    else alert(data.error || "Register failed");
  };

  const login = async () => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    const data = await res.json();
    if (res.ok) setToken(data.token);
    else alert(data.error || "Login failed");
  };

  const fetchTransactions = async () => {
    if (!token) return;
    const res = await fetch(`${API_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setTransactions(data);
  };

  const addTransaction = async () => {
    if (!token) return;
    const payload = {
      ...newTx,
      amount: parseFloat(newTx.amount),
    };

    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      setTransactions([data, ...transactions]);
      setNewTx({
        ...newTx,
        amount: "",
        note: "",
      });
    } else {
      alert(data.error || "Error adding transaction");
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ padding: "1rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>Budget App</h1>

      {!token && (
        <div>
          <h2>Login / Register</h2>
          <input
            name="email"
            placeholder="Email"
            value={authForm.email}
            onChange={handleAuthChange}
          />
          <br />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={handleAuthChange}
          />
          <br />
          <button onClick={login}>Login</button>
          <button onClick={register}>Register</button>
        </div>
      )}

      {token && (
        <>
          <h2>Add Transaction</h2>
          <input
            type="number"
            placeholder="Amount"
            value={newTx.amount}
            onChange={(e) =>
              setNewTx({ ...newTx, amount: e.target.value })
            }
          />
          <select
            value={newTx.type}
            onChange={(e) =>
              setNewTx({ ...newTx, type: e.target.value })
            }
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            placeholder="Category"
            value={newTx.category}
            onChange={(e) =>
              setNewTx({ ...newTx, category: e.target.value })
            }
          />
          <input
            placeholder="Note"
            value={newTx.note}
            onChange={(e) =>
              setNewTx({ ...newTx, note: e.target.value })
            }
          />
          <input
            type="date"
            value={newTx.date}
            onChange={(e) =>
              setNewTx({ ...newTx, date: e.target.value })
            }
          />
          <button onClick={addTransaction}>Add</button>

          <h2>Transactions</h2>
          <ul>
            {transactions.map((t) => (
              <li key={t.id}>
                {t.date} — {t.type} — ${t.amount} ({t.category}) {t.note}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
