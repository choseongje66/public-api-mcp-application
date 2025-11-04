// src/App.tsx
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import AuthForm from "./components/AuthForm";
import { getToken, clearToken } from "./lib/auth";
import {
  listConversations,
  createConversation,
  deleteConversation as delConv,
  fetchMessages,
  sendQuery,
} from "./lib/api";

type Msg = {
  id: number;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
};
type ConvItem = { id: number; title: string | null; createdAt: string };

export default function App() {
  const [authed, setAuthed] = useState<boolean>(!!getToken());
  const [convs, setConvs] = useState<ConvItem[]>([]);
  const [activeId, setActiveId] = useState<number>();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        const data = await listConversations();
        const items: ConvItem[] = Array.isArray(data)
          ? data
          : data?.items ?? [];
        if (items.length === 0) {
          const c = await createConversation("새 대화");
          const againData = await listConversations();
          const again = Array.isArray(againData)
            ? againData
            : againData?.items ?? [];
          setConvs(again);
          setActiveId(c.id);
        } else {
          setConvs(items);
          setActiveId(items[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [authed]);

  useEffect(() => {
    if (!authed || !activeId) return;
    (async () => {
      try {
        const data = await fetchMessages(activeId);
        const items: Msg[] = Array.isArray(data) ? data : data?.items ?? [];
        setMessages(items);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [authed, activeId]);

  async function onSend(text: string) {
    if (!authed || !activeId || loading) return;
    setLoading(true);

    // 1. 사용자 메시지를 먼저 UI에 추가
    const userMsg: Msg = { id: Date.now(), role: "user", content: text };
    // 2. 어시스턴트 메시지 셸(껍데기) 추가
    const assistantMsg: Msg = {
      id: Date.now() + 1,
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);

    try {
      const reader = await sendQuery(activeId, text);
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // 3. 어시스턴트 메시지 내용 실시간 업데이트
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: m.content + chunk } : m
          )
        );
      }

      // 4. 스트림 종료 후 대화 목록 갱신
      const list = await listConversations();
      const items: ConvItem[] = Array.isArray(list) ? list : list?.items ?? [];
      setConvs(items);
    } catch (e) {
      console.error(e);
      // 에러 발생 시 UI에 표시
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "오류가 발생했습니다." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function onNew() {
    try {
      const c = await createConversation("새 대화");
      const data = await listConversations();
      const items: ConvItem[] = Array.isArray(data) ? data : data?.items ?? [];
      setConvs(items);
      setActiveId(c.id);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  }

  async function onDelete(id: string | number) {
    try {
      await delConv(Number(id));
      const data = await listConversations();
      const items: ConvItem[] = Array.isArray(data) ? data : data?.items ?? [];
      setConvs(items);
      if (items.length) {
        setActiveId(items[0].id);
        const hist = await fetchMessages(items[0].id);
        const msgs: Msg[] = Array.isArray(hist) ? hist : hist?.items ?? [];
        setMessages(msgs);
      } else {
        const c = await createConversation("새 대화");
        const againData = await listConversations();
        const again = Array.isArray(againData)
          ? againData
          : againData?.items ?? [];
        setConvs(again);
        setActiveId(c.id);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  function onLogout() {
    clearToken();
    setAuthed(false);
    setConvs([]);
    setMessages([]);
    setActiveId(undefined);
  }

  if (!authed) {
    return <AuthForm onAuthed={() => setAuthed(true)} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#fafafa" }}>
      <Sidebar
        items={convs.map((c) => ({
          id: String(c.id),
          title: c.title ?? "제목 없음",
          createdAt: 0,
          updatedAt: 0,
          messages: [],
        }))}
        activeId={activeId ? String(activeId) : undefined}
        onSelect={(id) => setActiveId(Number(id))}
        onNew={onNew}
        onDelete={(id) => onDelete(id)}
      />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            height: 56,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            background: "#fff",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 600 }}>공공 api mcp</div>
          <button
            onClick={onLogout}
            style={{
              padding: "6px 10px",
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              background: "#fff",
            }}
          >
            로그아웃
          </button>
        </div>
        <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {messages.length ? (
            <MessageList messages={messages as any} />
          ) : (
            <div
              style={{ color: "#9ca3af", marginTop: 80, textAlign: "center" }}
            >
              왼쪽에서 대화를 선택하거나, 아래 입력창에 질문을 입력해
              시작하세요.
            </div>
          )}
        </div>
        <div style={{ padding: "12px 24px", background: "#fff" }}>
          <ChatInput onSend={onSend} disabled={loading || !activeId} />
        </div>
      </main>
    </div>
  );
}
