import type { Conversation } from "../lib/storage";

type Props = {
  items: Conversation[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

export default function Sidebar({
  items,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: Props) {
  return (
    <aside
      className="sidebar"
      style={{
        width: 280,
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        className="sidebar-toolbar"
        style={{ padding: 12, borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8 }}
      >
        <button
          className="sidebar-new-btn"
          onClick={onNew}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
          }}
        >
          + 새 대화
        </button>
      </div>

      <div
        className="sidebar-section-title"
        style={{ padding: 8, fontSize: 12, color: "#6b7280" }}
      >
        최근 대화
      </div>

      <div
        className="sidebar-list"
        style={{ overflowY: "auto", padding: 8, flex: 1 }}
      >
        {items.length === 0 && (
          <div className="sidebar-empty" style={{ color: "#9ca3af", fontSize: 14, padding: 8 }}>
            아직 대화가 없습니다.
          </div>
        )}
        {items.map((c) => {
          const active = c.id === activeId;
          return (
            <div
              key={c.id}
              className={`sidebar-item${active ? " sidebar-item-active" : ""}`}
              onClick={() => onSelect(c.id)}
              style={{
                padding: 10,
                borderRadius: 8,
                marginBottom: 6,
                cursor: "pointer",
                background: active ? "#e5f2ff" : "transparent",
                border: active ? "1px solid #93c5fd" : "1px solid transparent",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                className="sidebar-item-title"
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 190,
                }}
              >
                {c.title || "제목 없음"}
              </div>
              <button
                className="sidebar-delete-button"
                title="대화 삭제"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(c.id);
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#9ca3af",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
