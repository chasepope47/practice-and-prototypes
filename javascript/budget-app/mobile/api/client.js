// mobile/api/client.js
import { API_BASE, useAuth } from '../context/AuthContext';

// Hook-based helpers (for components)
export function useApi() {
  const { token } = useAuth();

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const get = async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error || 'Request failed';
      throw new Error(msg);
    }
    return data;
  };

  const post = async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data?.error || 'Request failed';
      throw new Error(msg);
    }
    return data;
  };

  return { get, post };
}
