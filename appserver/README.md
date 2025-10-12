# Application Server (Express + Prisma + MCP)

이 디렉터리는 백엔드 서버로, 대화 데이터 관리 및 MCP/LLM 연동 기능을 담당합니다.

## 실행 방법

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

기본 포트: 7070

## 디렉터리 구조

```
src/
├─ server.ts
├─ app.ts
├─ routes/
│  ├─ conversation.routes.ts
│  ├─ chat.routes.ts
│  └─ auth.routes.ts
├─ controllers/
├─ services/
│  ├─ llm/
├─ db/prisma.ts
├─ middlewares/
└─ schemas/
```

## 주요 기능

- 대화 CRUD (생성, 조회, 삭제)
- 메시지 저장 및 조회
- JWT 기반 인증 (stub)
- LLM 및 MCP 연동 구조 정의

## API 개요

| 메서드 | 엔드포인트                    | 설명                     |
| ------ | ----------------------------- | ------------------------ |
| GET    | `/health`                     | 서버 상태 확인           |
| GET    | `/conversations`              | 대화 목록 조회           |
| POST   | `/conversations`              | 새 대화 생성             |
| DELETE | `/conversations/:id`          | 대화 삭제                |
| GET    | `/conversations/:id/messages` | 메시지 조회              |
| POST   | `/chat/query`                 | 메시지 전송 및 응답 생성 |

## 향후 계획

- Ollama + MCP 통합
- JWT 로그인 및 사용자 관리
- 테스트 코드 추가
