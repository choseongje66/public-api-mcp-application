// src/lib/auth.ts
const KEY = "auth_token";

export function getToken() {
  return localStorage.getItem(KEY) || "";
}
export function setToken(token: string) {
  localStorage.setItem(KEY, token);
}
export function clearToken() {
  localStorage.removeItem(KEY);
}

export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // 기본 JSON 응답 가정
  const res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    // 토큰 만료/미인증 → 자동 로그아웃
    clearToken();
    // 선택: 새로고침으로 로그인 화면 유도
    // location.reload();
  }
  return res;
}
