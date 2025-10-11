const BASE = "http://localhost:7070";

export async function sendQuery(text: string) {
    const r = await fetch(`${BASE}/chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    return r.json();
}
