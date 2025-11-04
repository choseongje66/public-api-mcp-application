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

  // 상태코드별 처리
  let data: any = null;
  try {
    data = await r.json();
  } catch {}
  if (!r.ok) {
    // 서버가 { ok:false, error } 반환하거나, validation 에러일 수 있음
    throw new Error(data?.error || `Register failed (${r.status})`);
  }
  return data; // 일반적으로 { ok:true } 또는 { ok:true, user:{...} }
}

export async function login(email: string, password: string) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  let data: any = null;
  try {
    data = await r.json();
  } catch {}
  if (!r.ok) {
    throw new Error(data?.error || `Login failed (${r.status})`);
  }
  return data; // { accessToken, user } 또는 { ok:true, token, user }
}

// --- Conversations & Chat (인증 필요) ---
export async function listConversations() {
  const r = await authFetch(`${BASE}/conversations`);
  if (!r.ok) throw new Error(`Failed to list conversations (${r.status})`);
  return r.json();
}

export async function createConversation(title?: string) {
  const r = await authFetch(`${BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!r.ok) throw new Error(`Failed to create conversation (${r.status})`);
  return r.json();
}

export async function deleteConversation(convId: number) {
  const r = await authFetch(`${BASE}/conversations/${convId}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error(`Failed to delete conversation (${r.status})`);
  return r.json();
}

export async function fetchMessages(convId: number) {
  const r = await authFetch(`${BASE}/conversations/${convId}/messages`);
  if (!r.ok) throw new Error(`Failed to load messages (${r.status})`);
  return r.json();
}

export async function sendQuery(convId: number, text: string) {
  const r = await authFetch(`${BASE}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ convId, text }),
  });
  if (!r.ok) throw new Error(`Failed to send query (${r.status})`);
  // 스트리밍이 아니므로, 응답 본문이 필요 없습니다.
  // 후속 fetchMessages로 데이터를 다시 가져옵니다.
  // 스트리밍 구현 시 이 함수는 ReadableStream을 반환해야 합니다.
  if (!r.body) throw new Error("Response body is missing");
  return r.body.getReader();
}
