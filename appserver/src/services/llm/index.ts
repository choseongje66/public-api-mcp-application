export type Role = "system" | "user" | "assistant" | "tool";
export type NeutralMessage = { role: Role; content: string };

export interface LlmAdapter {
  chat(
    messages: NeutralMessage[],
    opts?: { model?: string }
  ): Promise<NeutralMessage>;
}

// (필요 시) 중립 ↔ provider 변환 유틸을 여기에 추가
