// src/components/AuthForm.tsx
import { useState } from "react";
import { login, register } from "../lib/api";
import { setToken } from "../lib/auth";

type Props = {
  onAuthed: () => void; // 로그인/회원가입 성공 시 호출
};

export default function AuthForm({ onAuthed }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      if (mode === "register") {
        // 1) 회원가입 시도
        await register(email, pw);
        // 일부 서버는 {ok:true}, 일부는 {user:{...}} 반환 → 에러 없으면 성공으로 간주
      }

      // 2) 로그인 시도
      const r = await login(email, pw);
      // 다양한 백엔드 응답 포맷 대비: accessToken / token / jwt 등
      const token =
        r?.accessToken ||
        r?.token ||
        r?.jwt ||
        (r?.data?.accessToken ?? r?.data?.token) ||
        "";

      if (!token) {
        if (r?.ok && typeof r?.token === "string") {
          setToken(r.token);
          onAuthed();
          return;
        }
        throw new Error(r?.error || "로그인 실패(토큰 없음)");
      }

      setToken(token);
      onAuthed();
    } catch (e: any) {
      setErr(e?.message || "처리에 실패했습니다");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "80px auto",
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 12 }}>
        {mode === "login" ? "로그인" : "회원가입"}
      </h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode("login")}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: mode === "login" ? "#f3f4f6" : "#fff",
          }}
        >
          로그인
        </button>
        <button
          onClick={() => setMode("register")}
          style={{
            padding: "6px 10px",
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: mode === "register" ? "#f3f4f6" : "#fff",
          }}
        >
          회원가입
        </button>
      </div>

      <form onSubmit={submit}>
        <div style={{ marginBottom: 10 }}>
          <label style={{ display: "block", fontSize: 12, color: "#6b7280" }}>
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 12, color: "#6b7280" }}>
            비밀번호
          </label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.currentTarget.value)}
            required
            minLength={4}
            style={{
              width: "100%",
              padding: 10,
              border: "1px solid #e5e7eb",
              borderRadius: 6,
            }}
          />
        </div>

        {err && (
          <div style={{ color: "#b91c1c", fontSize: 12, marginBottom: 12 }}>
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #e5e7eb",
            background: "#111827",
            color: "#fff",
          }}
        >
          {loading
            ? "처리 중..."
            : mode === "login"
            ? "로그인"
            : "회원가입 후 로그인"}
        </button>
      </form>
    </div>
  );
}
