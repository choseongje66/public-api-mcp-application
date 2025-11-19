import type { Msg } from "../lib/storage";

const TypingIndicator = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <style>
      {`
        @keyframes typing-blink {
          0% { opacity: 0.2; }
          50% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .typing-dot {
          width: 8px;
          height: 8px;
          background-color: #9ca3af;
          border-radius: 50%;
          animation: typing-blink 1.4s infinite both;
        }
      `}
    </style>
    <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
    <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
    <div className="typing-dot" style={{ animationDelay: "0.6s" }} />
  </div>
);

export default function MessageList({ messages }: { messages: Msg[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            alignSelf: m.role === "user" ? "flex-end" : "flex-start",
            maxWidth: 720,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
            {m.role}
          </div>
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: m.role === "user" ? "#DCF2FF" : "#F2F2F2",
              whiteSpace: "pre-wrap",
              lineHeight: 1.5,
            }}
          >
            {m.role === "assistant" && !m.content ? (
              <TypingIndicator />
            ) : (
              m.content
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
