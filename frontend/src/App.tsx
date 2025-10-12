import { useEffect, useMemo, useState } from "react";
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
      const { items } = await listConversations();
      if (items.length === 0) {
        const c = await createConversation("새 대화");
        const { items: again } = await listConversations();
        setConvs(again);
        setActiveId(c.id);
      } else {
        setConvs(items);
        setActiveId(items[0].id);
      }
    })();
  }, [authed]);

  useEffect(() => {
    if (!authed || !activeId) return;
    (async () => {
      const { items } = await fetchMessages(activeId);
      setMessages(items as any);
    })();
  }, [authed, activeId]);

  async function onSend(text: string) {
    if (!authed || !activeId || loading) return;
    setLoading(true);
    try {
      await sendQuery(activeId, text);
      const [{ items: msgs }, { items: list }] = await Promise.all([
        fetchMessages(activeId),
        listConversations(),
      ]);
      setMessages(msgs as any);
      setConvs(list);
    } finally {
      setLoading(false);
    }
  }

  async function onNew() {
    const c = await createConversation("새 대화");
    const { items } = await listConversations();
    setConvs(items);
    setActiveId(c.id);
    setMessages([]);
  }

  async function onDelete(id: string | number) {
    await delConv(Number(id));
    const { items } = await listConversations();
    setConvs(items);
    if (items.length) {
      setActiveId(items[0].id);
      const { items: msgs } = await fetchMessages(items[0].id);
      setMessages(msgs as any);
    } else {
      const c = await createConversation("새 대화");
      const { items: again } = await listConversations();
      setConvs(again);
      setActiveId(c.id);
      setMessages([]);
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
