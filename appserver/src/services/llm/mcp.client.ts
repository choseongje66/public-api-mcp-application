// MCP 서버와의 통신을 캡슐화할 자리.
// 예: 특정 툴 호출 -> 결과(JSON) -> LLM 컨텍스트에 주입
export type McpToolCall = { name: string; args?: any };
export async function callMcp(tool: McpToolCall): Promise<any> {
  // TODO: MCP 서버 호출 (HTTP/WebSocket 등)
  return { ok: true, tool, data: {} };
}
