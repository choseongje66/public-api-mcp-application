# Frontend (React + Vite)

이 디렉터리는 MCP 기반 공공데이터 채팅형 웹 클라이언트를 제공합니다.

## 실행 방법

```bash
npm install
npm run dev
```

기본 포트: http://localhost:5173

## 폴더 구조

```
src/
├─ App.tsx
├─ components/
│  ├─ Sidebar.tsx
│  ├─ MessageList.tsx
│  └─ ChatInput.tsx
└─ lib/
   └─ api.ts
```

## 주요 기능

- 대화 목록 표시 및 삭제
- 메시지 전송 / 응답 표시
- 대화 제목 자동 생성

## API 연동

기본 백엔드 주소: http://localhost:7070

| 기능         | 엔드포인트                    | 메서드 |
| ------------ | ----------------------------- | ------ |
| 대화 목록    | `/conversations`              | GET    |
| 새 대화 생성 | `/conversations`              | POST   |
| 대화 삭제    | `/conversations/:id`          | DELETE |
| 메시지 조회  | `/conversations/:id/messages` | GET    |
| 메시지 전송  | `/chat/query`                 | POST   |

## 향후 개선 예정

- 로그인 UI 및 토큰 저장
- LLM 응답 하이라이팅
- MCP 호출 결과 시각화
