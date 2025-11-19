import { useState, useRef } from "react";

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function resizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 280);
    el.style.height = next + "px";
  }

  function submit() {
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText("");
    if (textareaRef.current) {
      resizeTextarea(textareaRef.current);
    }
  }

  return (
    <div
      className="chat-input"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        borderRadius: 20,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        padding: "8px 10px 8px 20px",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.08)",
        gap: 8,
      }}
    >
      <textarea
        ref={textareaRef}
        className="chat-input-textarea"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          if (textareaRef.current) {
            resizeTextarea(textareaRef.current);
          }
        }}
        placeholder="무엇이든 물어보세요… 예) 2025년 10월 29일 대전 날씨 알려줘."
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          padding: 0,
          borderRadius: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 14,
          lineHeight: 1.5,
          minHeight: 20,
          maxHeight: 280,
          overflowY: "auto",
        }}
        onKeyDown={(e) => {
          // Enter = 전송, Shift+Enter = 줄바꿈
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <button
        className="chat-input-send"
        onClick={submit}
        disabled={disabled || !text.trim()}
        style={{
          padding: "8px 14px",
          borderRadius: 999,
          border: "none",
          background: disabled || !text.trim() ? "#d1d5db" : "#3b82f6",
          color: "#fff",
          fontWeight: 600,
          fontSize: 13,
          cursor: disabled || !text.trim() ? "default" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        보내기
      </button>
    </div>
  );
}
