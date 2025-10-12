import type { LlmAdapter, NeutralMessage } from "./index";

export class OllamaAdapter implements LlmAdapter {
  constructor(
    private baseUrl = "http://localhost:11434",
    private model = "llama3.1:8b"
  ) {}
  async chat(messages: NeutralMessage[]): Promise<NeutralMessage> {
    // TODO: ollama-js 사용해 실제 호출
    // 임시 더미
    const last = messages[messages.length - 1]?.content ?? "";
    return { role: "assistant", content: `Ollama stub 응답: ${last}` };
  }
}
