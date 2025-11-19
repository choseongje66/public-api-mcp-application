import type { Msg } from "../lib/storage";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
    <div
      className="message-list"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {messages.map((m, i) => (
        <div key={i} className={`message-row message-row-${m.role}`} style={{ width: "100%" }}>
          <div
            className="message-block"
            style={{
              maxWidth: 720,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div className="message-role" style={{ fontSize: 12, opacity: 0.6, marginBottom: 4 }}>
              {m.role}
            </div>
            <div
              className={`message-bubble message-bubble-${m.role}`}
              style={{
                padding: 12,
                borderRadius: 8,
                background: m.role === "user" ? "#DCF2FF" : "#F2F2F2",
                lineHeight: 1.5,
                maxWidth: "100%",
                marginLeft: m.role === "user" ? 56 : undefined,
                marginRight: m.role === "assistant" ? 56 : undefined,
                ...(m.role === "user" && { whiteSpace: "pre-wrap" }),
              }}
            >
              {m.role === "assistant" && !m.content ? (
                <TypingIndicator />
              ) : m.role === "assistant" ? (
                <>
                  <style>
                    {`
                    .markdown-content table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-top: 1em;
                      margin-bottom: 1em;
                    }
                    .markdown-content th, .markdown-content td {
                      border: 1px solid #d1d5db;
                      padding: 8px;
                      text-align: left;
                    }
                    .markdown-content th {
                      background-color: #f3f4f6;
                      font-weight: 600;
                    }
                  `}
                  </style>
                  <div className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </>
              ) : (
                m.content
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
