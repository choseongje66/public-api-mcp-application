## 프로젝트 구조

```
public-api-mcp/
├── frontend/        # React 기반 클라이언트
└── appserver/       # Express 기반 백엔드
```

## 기술 스택

| 구분     | 기술                               |
| -------- | ---------------------------------- |
| Frontend | React, Vite, TypeScript            |
| Backend  | Node.js, Express.js, Prisma, MySQL |
| DB       | MySQL + Prisma ORM                 |

## 실행 방법

### 1. 백엔드 (appserver)

```bash
cd appserver
npm install
npx prisma migrate dev
npm run dev
```

서버 기본 주소: http://localhost:7070

### 2. 프론트엔드 (frontend)

```bash
cd frontend
npm install
npm run dev
```

프론트 기본 주소: http://localhost:5173
