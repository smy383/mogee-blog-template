# Mogee Blog Template

> AI(Claude Code)로 관리하는 개인 블로그 + 포트폴리오 템플릿

React + Firebase + MCP 기반의 개인 블로그/포트폴리오 사이트입니다.
**Claude Code**와 MCP 서버를 통해 블로그 글 작성, 포트폴리오 관리를 AI가 대신 해줍니다.

## Features

- **Blog** - 마크다운 지원, 태그 필터, 조회수/좋아요/댓글
- **Portfolio** - 프로젝트 쇼케이스
- **MCP Server** - Claude Code로 블로그 글 작성/수정/삭제
- **Multilingual** - 한국어/영어/일본어 지원 (ko/en/ja)
- **SEO** - Open Graph, Twitter Card, JSON-LD, Sitemap
- **Glassmorphism UI** - Tailwind CSS + Framer Motion

## Tech Stack

- **Frontend:** React 19 + TypeScript + Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Storage, Hosting, Functions)
- **AI Integration:** MCP Server (Model Context Protocol)

---

## Quick Start (with Claude Code)

> Claude Code에게 이 레포를 보여주고 "이 블로그를 내 Firebase로 세팅해줘"라고 하면 됩니다!

### Step 1: Clone & Install

```bash
git clone https://github.com/smy383/mogee-blog-template.git
cd mogee-blog-template
npm install
cd blog-mcp && npm install && cd ..
```

### Step 2: Firebase Setup

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. **Authentication** > Email/Password 로그인 활성화
3. **Firestore Database** 생성 (asia-northeast3 권장)
4. **Storage** 활성화
5. **Hosting** 활성화
6. 프로젝트 설정 > 일반 > 웹앱 추가 > Firebase 설정값 복사

### Step 3: Environment Variables

`.env.example`을 복사해서 `.env.local` 생성:

```bash
cp .env.example .env.local
```

`.env.local`에 Firebase 설정값을 입력:

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

REACT_APP_SITE_NAME=My Blog
REACT_APP_SITE_URL=https://your-project.web.app
REACT_APP_GITHUB_URL=https://github.com/your-username
REACT_APP_CONTACT_EMAIL=your-email@example.com
```

### Step 4: Firebase Security Rules

`firestore.rules`와 `storage.rules`에서 `YOUR_ADMIN_UID`를 본인의 Firebase Auth UID로 교체:

> Firebase Console > Authentication > Users에서 UID 확인

```
allow write: if request.auth.uid == 'YOUR_ADMIN_UID';
```

### Step 5: Deploy

```bash
# Firebase CLI 설치 (최초 1회)
npm install -g firebase-tools
firebase login

# 프로젝트 연결
firebase use --add your-project-id

# 빌드 & 배포
npm run build
firebase deploy --only hosting,firestore:rules,storage
```

### Step 6: Cloud Functions (Sitemap)

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## MCP Server Setup (Blog Management via Claude Code)

### 1. Service Account 생성

Firebase Console > 프로젝트 설정 > 서비스 계정 > 새 비공개 키 생성 > JSON 파일 다운로드

```bash
# 다운로드한 파일을 blog-mcp/ 폴더로 이동
mv ~/Downloads/your-project-firebase-adminsdk-xxxxx.json blog-mcp/serviceAccount.json
```

### 2. MCP Server 빌드

```bash
cd blog-mcp
npm run build
```

### 3. Claude Code에 MCP 등록

`~/.claude/claude_desktop_config.json` (또는 Claude Code 설정)에 추가:

```json
{
  "mcpServers": {
    "blog-manager": {
      "command": "node",
      "args": ["/absolute/path/to/mogee-blog-template/blog-mcp/dist/index.js"],
      "env": {
        "BLOG_URL": "https://your-project.web.app"
      }
    }
  }
}
```

### 4. 사용 예시

Claude Code에게 말하기:

```
"블로그에 새 글 써줘. 제목은 'My First Post', 내용은 ..."
"포트폴리오에 새 프로젝트 추가해줘"
"블로그 글 목록 보여줘"
```

---

## Available MCP Tools

| Tool | Description |
|------|-------------|
| `blog_write` | 새 블로그 글 작성 |
| `blog_edit` | 기존 글 수정 |
| `blog_delete` | 글 삭제 |
| `blog_list` | 글 목록 조회 |
| `blog_get` | 글 상세 조회 |
| `portfolio_add` | 포트폴리오 추가 |
| `portfolio_edit` | 포트폴리오 수정 |
| `portfolio_delete` | 포트폴리오 삭제 |
| `portfolio_list` | 포트폴리오 목록 |

---

## Customization

### Hero & Apps 섹션
- `src/components/Hero.tsx` - 메인 히어로 섹션
- `src/components/Apps.tsx` - 프로젝트 쇼케이스 (appsData 배열 수정)

### 다국어 문자열
- `src/contexts/LanguageContext.tsx` - UI 문자열 (ko/en/ja)

### 스타일
- `tailwind.config.js` - 테마 색상 커스터마이징

---

## Project Structure

```
mogee-blog-template/
├── src/
│   ├── components/     # React 컴포넌트
│   ├── pages/          # 페이지 (Home, Portfolio, PostDetail, Admin)
│   ├── contexts/       # Auth, Language context
│   └── firebase/       # Firebase 설정
├── public/             # 정적 파일
├── functions/          # Cloud Functions (sitemap)
├── blog-mcp/           # MCP 서버
│   └── src/index.ts    # MCP 도구 정의
├── firestore.rules     # Firestore 보안 규칙
├── storage.rules       # Storage 보안 규칙
└── .env.example        # 환경변수 템플릿
```

---

## License

MIT License

---

Made with ❤️ by [Mogee](https://mogee.org) | Powered by Claude Code
