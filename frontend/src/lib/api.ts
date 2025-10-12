const BASE = "http://localhost:7070";

// 대화 목록
export async function listConversations() {
  const r = await fetch(`${BASE}/conversations`);
  return r.json(); // { items: [{id,title,createdAt}, ...] }
}

// 대화 생성
export async function createConversation(title?: string) {
  const r = await fetch(`${BASE}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return r.json(); // { id, title, createdAt, ... }
}

// 대화 삭제
export async function deleteConversation(convId: number) {
  const r = await fetch(`${BASE}/conversations/${convId}`, {
    method: "DELETE",
  });
  return r.json();
}

// 메시지 조회
export async function fetchMessages(convId: number) {
  const r = await fetch(`${BASE}/conversations/${convId}/messages`);
  return r.json(); // { items: [{id,role,content,createdAt}, ...] }
}

// 메시지 전송 (DB 저장)
export async function sendQuery(convId: number, text: string) {
  const r = await fetch(`${BASE}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ convId, text }),
  });
  return r.json(); // { messages: [...] }
}
