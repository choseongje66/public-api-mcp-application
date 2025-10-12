// src/lib/api.ts
import { authFetch } from "./auth";

const BASE = "http://localhost:7070";

// --- Auth ---
export async function register(email: string, password: string) {
  const r = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return r.json();
}

export async function login(email: string, password: string) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return r.json(); // { ok, token, user }
}

// --- Conversations & Chat (인증 필요) ---
export async function listConversations() {
  const r = await authFetch(`${BASE}/conversations`);
  return r.json();
}

export async function createConversation(title?: string) {
  const r = await authFetch(`${BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return r.json();
}

export async function deleteConversation(convId: number) {
  const r = await authFetch(`${BASE}/conversations/${convId}`, {
    method: "DELETE",
  });
  return r.json();
}

export async function fetchMessages(convId: number) {
  const r = await authFetch(`${BASE}/conversations/${convId}/messages`);
  return r.json();
}

export async function sendQuery(convId: number, text: string) {
  const r = await authFetch(`${BASE}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ convId, text }),
  });
  return r.json();
}
