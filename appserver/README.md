# Application Server (Express + Prisma + MCP)

이 디렉터리는 백엔드 서버로, 대화 데이터 관리 및 MCP/LLM 연동 기능을 담당합니다.

## 의존성

-   해당 프로젝트는 [MySQL](https://www.mysql.com) 8.0.44 버전을 필요로 합니다.
    -   만약 해당 버전의 MySQL 서버가 설치되어 있지 않은 경우,
        [MySQL 튜토리얼](https://dev.mysql.com/doc/refman/8.0/en/installing.html)에
        따라 설치를 진행해 주세요.
    -   MacOS 환경에서는 바이너리 경로가 `PATH` 환경변수에 기본적으로 등록되지않
        는 문제점이 있습니다. 다음을 `~/.zshrc` 등의 쉘 설정 파일에 추가하고
        `source ~/.zshrc`를 통해 환경변수를 업데이트해주세요.
        ```bash
        export PATH="/usr/local/mysql/bin:$PATH" # 기본 패키지 인스톨러의 설치 경로 가정.
        ```

## 초기화 방법

-   Prisma를 통한 데이터베이스 마이그레이션 이전에, 데이터베이스 유저 생성과 권
    한 설정이 필요합니다.
-   먼저, 프로젝트 루트 디렉터리에서 다음을 통해 필요한 의존성을 설치하고 환경변
    수 설정파일 템플릿을 실제 `.env` 파일로 복사해 주세요.

```bash
npm install
cp .env.example .env
```

-   이후에는, `.env` 파일에 정의되어 있는 `DATABASE_NAME`, `DATABASE_USER`,
    `DATABASE_PASSWORD`를 각각 프로젝트에 사용할 데이터베이스 이름과 유저, 비밀
    번호로 변경해 주세요.
    -   각각은 따옴표를 제외한 데이터베이스, 유저 이름과 비밀번호입니다.
-   다음으로, MySQL에 프로젝트에 사용할 유저 및 데이터베이스를 생성하기 위해 다
    음을 실행해 주세요.

```bash
mysql -e "CREATE USER '$DATABASE_USER'@'localhost' IDENTIFIED BY '$DATABASE_PASSWORD';"
mysql -e "CREATE DATABASE IF NOT EXISTS $DATABASE_NAME;"
mysql -e "GRANT ALL PRIVILEGES ON $DATABASE_NAME.* TO $DATABASE_USER@'%' IDENTIFIED BY '$DATABASE_PASSWORD';"
mysql -e "GRANT CREATE, DROP, REFERENCES, ALTER ON *.* TO $DATABASE_USER@'%';"
```

-   이후에는 Prisma를 통한 마이그레이션을 진행해 주세요.

```bash
npx prisma migrate dev --name init
```

## 초기화 이후 실행 방법

-   위 초기화 과정이 진행되었다면, `npm run dev`를 통해 어플리케이션 서버를 실행
    할 수 있습니다.
-   서버가 동작하는 기본 포트는 `7070`이며, 실행시
    `PORT=your_port npm run dev`와 같이 `PORT` 환경변수를 전달하거나
    `src/server.ts`의 `PORT`를 수정하여 변경할 수 있습니다.

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

-   대화 CRUD (생성, 조회, 삭제)
-   메시지 저장 및 조회
-   JWT 기반 인증 (stub)
-   LLM 및 MCP 연동 구조 정의

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

-   Ollama + MCP 통합
-   JWT 로그인 및 사용자 관리
-   테스트 코드 추가
