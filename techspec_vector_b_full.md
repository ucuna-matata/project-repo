# 0. Future of Work & Careers — Vector B Web App (Full Technical Specification)

> **Stack**: React + TypeScript (Vite) · Django REST Framework (Python) · PostgreSQL · Google OAuth 2.0 · Docker · GitHub Actions · Playwright/Jest · PyTest · LangChain/OpenAI‑compatible LLM · Playwright PDF · i18n (react‑i18next)  
> **Goal (12 hours)**: Ship a working MVP that helps students get hired: CV builder, interview simulator, learning trainer; with dashboard, data privacy, and export.  
> **This spec is tailored to the hackathon rubric and constraints.**

---

## 1. Product Scope & Demo Scenario

### 1.1 MVP Scope (must-have)
- **Google OAuth** sign-in & sign-out, profile restore after login.
- **Dashboard**: entry to modules, user state (CV completeness, last scores), quick actions.
- **CV Master**: form with field validation → live preview in at least **2 templates** → export to **PDF** → **Generate CV with LLM** option.
- **Interview**: 5–8 questions with **timer**, graded summary (score + checklist) saved in profile.
- **Trainer**: at least one quiz/challenge with results persisted.
- **Export results** + **Profile import/export** (JSON).
- **Erase my data**: GDPR-style delete from the system.

### 1.2 Demo Flow (happy path, 3–5 minutes)
1. Login with Google → profile restored.
2. Dashboard shows modules + status.
3. CV Master → fill fields (validate) → preview in Template A/B → **Generate CV with AI** → export **PDF/DOCX**.
4. Interview → answer timed 5–8 Q → see **score** and **checklist** → saved in profile.
5. Trainer → complete quiz → see score.
6. Export profile.json → erase my data → relogin shows clean slate.

---

## 2. High‑Level Architecture (with Mermaid)

```mermaid
flowchart LR
  subgraph Client[Frontend (React + TS)]
    UI[Pages & Components] --> RHF[React Hook Form]
    UI --> RQ[RTK Query / React Query]
    UI --> I18N[react-i18next]
  end

  subgraph API[Backend (Django + DRF)]
    Auth[Google OAuth Controller]
    CVS[CV Service]
    INT[Interview Service]
    TRN[Trainer Service]
    PDF[HTML->PDF (Playwright)]
    AI[LLM Integration]
  end

  DB[(PostgreSQL)]
  ST[S3/MinIO Storage]
  IdP[(Google OAuth)]
  LLM[(OpenAI-compatible LLM)]

  Client <-->|HttpOnly cookie| API
  API --> DB
  API --> ST
  Auth --> IdP
  AI --> LLM
  PDF --> ST
```

---

## 3. System Architecture (Text)

- **Frontend**: React + TS SPA (Vite). State: Redux Toolkit Query or React Query. Routing: React Router. Styling: Tailwind + shadcn/ui.
- **Backend**: Django REST Framework (DRF). Auth: Google OAuth 2.0 (handled server-side). Session: HttpOnly Secure cookie (SameSite=Lax/Strict).
- **DB**: PostgreSQL via Django ORM & migrations.
- **AI**: Server-side LLM calls (LangChain/litellm/OpenAI-compatible) for CV generation and interview feedback.
- **Storage**: Generated PDFs/exports → S3-compatible (MinIO in dev) with signed, expiring URLs.
- **PDF**: HTML → PDF using Playwright (server-side) for pixel-perfect CV templates.
- **Containerization**: Docker (frontend, backend, db, minio) + Docker Compose.
- **CI/CD**: GitHub Actions (typecheck, tests, build, E2E, artifacts, optional push images).

---

## 4. Data Model

### 4.1 Entities
- **User**: `id`, `email`, `full_name`, `avatar_url`, `google_sub`, `created_at`, `last_login_at`, `locale`, `consent_analytics`.
- **Profile**: `user_id` (1–1), links/contacts, education[], experience[], skills[], projects[], summary, preferences (job type, location), **history log**.
- **CV**: `id`, `user_id`, `title`, `template_key`, `sections` (JSON), `rendered_pdf_url`, `version`, `changelog[]`, `created_at`, `updated_at`.
- **InterviewSession**: `id`, `user_id`, `questions[]`, `answers[]`, `started_at`, `ended_at`, `duration_sec`, `score`, `checklist[]`, `ai_feedback`.
- **TrainerResult**: `id`, `user_id`, `module_key`, `attempts`, `score`, `metadata`.
- **AuditEvent**: `id`, `user_id`, `type`, `payload`, `ts` (e.g., login, export, erase).
- **DeletionRequest**: `id`, `user_id`, `status`, `requested_at`, `processed_at`.

### 4.2 Privacy & Retention
- **Erase**: hard-delete user rows (cascade) + storage purge + session revoke.
- **Export**: JSON bundle of user data (profile, CVs, interview, trainer) with schema version.

---

## 5. Security & Privacy

- **OAuth** via Google; backend exchanges code for tokens; no tokens in frontend URLs; tokens not stored in localStorage.
- **Session**: HttpOnly + Secure cookie; CSRF token on mutating calls.
- **Secrets**: from `.env`/secrets manager; never committed.
- **PII minimization**: only MVP-required fields; analytics disabled by default; opt-in only.
- **Data deletion**: in-app “Erase my data” performs complete removal.
- **Logging**: structured; no PII; redacted traces.
- **Rate limits**: per IP/user on sensitive endpoints.
- **CORS/HTTPS**: strict allowlist; HTTPS in staging/prod.

---

## 6. Frontend (React + TypeScript)

### 6.1 Structure
```
/src
  /app          # providers, routing
  /pages        # Dashboard, CV, Interview, Trainer, Settings
  /features     # cv, auth, interview, trainer, profile
  /components   # UI components (forms, cards, timers)
  /services     # API clients (RTK Query or React Query)
  /i18n         # translations (en, uk)
  /styles
```

### 6.2 Key Screens
- **Auth Callback**: handles OAuth redirect, sets session.
- **Dashboard**: cards for modules, progress bars, quick actions (Export, Erase).
- **CV Master**: form (React Hook Form + zod) → preview **Template A (clean)** & **Template B (two-column)** → Save, **Generate with AI**, Export PDF/DOCX, History (revert field).
- **Interview**: 5–8 questions; countdown timer; autosave; submit → Score + Checklist + optional AI hints.
- **Trainer**: quiz (≥10 Q) with categories; store results.
- **Settings**: Locale (uk/en), analytics opt-in, export JSON, erase account.

### 6.3 Libraries
- **Routing**: React Router
- **State/queries**: Redux Toolkit Query *or* React Query
- **Forms**: React Hook Form + zod
- **UI**: Tailwind + shadcn/ui
- **i18n**: react-i18next
- **Testing**: Jest + Testing Library; E2E Playwright

---

## 7. Backend (Django + DRF)

### 7.1 Apps
- `authz` (OAuth flow, sessions)
- `profiles` (User, Profile, CV, history)
- `interview` (questions, sessions, scoring)
- `trainer` (quiz engine, results)
- `files` (storage, signed URLs, PDF jobs)
- `adminapi` (optional admin tools)

### 7.2 API (selected)
- `POST /auth/google/start` → redirect URL
- `GET /auth/google/callback?code=` → set session cookie
- `GET /me` → current user + profile
- `PUT /profile` → update profile
- `POST /cv` / `PUT /cv/:id` / `GET /cv/:id` / `GET /cv`
- `POST /cv/:id/export?format=pdf|docx`
- `POST /cv/generate` (LLM prompt with current profile)
- `POST /interview/session` → create with 5–8 Q
- `PUT /interview/session/:id/answer` → save
- `POST /interview/session/:id/submit` → score + checklist + ai_feedback
- `POST /trainer/attempt` → start quiz
- `POST /trainer/attempt/:id/submit`
- `POST /export` → JSON bundle
- `POST /erase` → schedule immediate deletion
- `GET /healthz`

### 7.3 Services
- **LLMService**: prompts for CV bullets, summary tweaks, interview hints.
- **PDFService**: HTML templates → PDF (Playwright headless).
- **StorageService**: MinIO/S3 adapter, signed links.
- **ScoringService**: rubric-based baseline; optional AI annotator.

### 7.4 Validation & Errors
- DRF serializers; normalized error shape: `{code, message, details?}`.

---

## 8. AI Integration

### 8.1 Required
- **Generate CV with LLM**: produce bullet points and summary per job target, using user profile as context. Server-side with token limits and guardrails.

### 8.2 Bonus
- **Interview AI feedback**: strengths/weaknesses + improvement tips.
- **Trainer explanations**: rationale for correct answers.

> Provider via env: OpenAI-compatible endpoint, Azure OpenAI, local vLLM.

---

## 9. Documents & Exports

- **CV Templates**: Handcrafted HTML (Tailwind print styles), A4, margins, fonts.
- **Export formats**: **PDF (required)** + **DOCX (bonus)**.
- **Profile Import/Export**: JSON schema with version; backward compatible.

---

## 10. Internationalization (Bonus)

- `en`, `uk` locales; persisted per user; date/number formatting; RTL-ready scaffolding.

---

## 11. History & Versioning (Bonus)

- **Field-level history** in CV (simple patch log).
- **Revert per-field** from UI.
- Backend keeps `CV.changelog[]` (author, ts, diff).

---

## 12. CI/CD (Bonus)

### 12.1 GitHub Actions
- **Frontend**: typecheck, unit tests, build, upload artifact.
- **Backend**: black/ruff, mypy, pytest, build Docker.
- **E2E**: Playwright against docker-compose on PR.
- **Release**: tag → push images.

### 12.2 Preview Environments (optional)
- PR → ephemeral compose up on runner, shareable artifact.

---

## 13. Accessibility & UX

- WCAG AA contrast, focus rings, keyboard nav, ARIA labels.
- Forms with inline errors; autosave; optimistic UI where safe.
- Responsive layout; print styles for CV.

---

## 14. Performance & Reliability

- API caching for static questions (interview/trainer).
- Client code-splitting; lazy-load.
- DB indices on `user_id`, timestamps.
- Health checks, liveness/readiness endpoints.
- Basic throttling and exponential backoff.

---

## 15. Testing

- **Unit**: utils, hooks, services.
- **API**: pytest + DRF test client, factory data.
- **E2E**: Playwright—auth flow, CV create/export, interview, trainer, erase.
- **PDF**: snapshot/pixel-diff if time permits.

---

## 16. Setup & Run

### 16.1 Prereqs
- Docker & Docker Compose, Node 20+, Python 3.11+

### 16.2 Env
- `WEB_ORIGIN`, `API_ORIGIN`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `DB_URL` (Postgres), `STORAGE_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_KEY/SECRET`
- `LLM_PROVIDER_URL`, `LLM_API_KEY`

### 16.3 Commands
```bash
# dev
docker compose up --build

# frontend only
cd frontend && npm i && npm run dev

# backend only
cd backend && pip install -r requirements.txt && python manage.py runserver
```

---

## 17. Compliance with Hackathon Rubric

- **Vector B requirements**: Google OAuth, profile restore, CV w/ 2 templates & PDF, interview or trainer w/ timer + persistence, import/export ✅  
- **We implement all three modules** (CV + Interview + Trainer) ✅  
- **Bonuses**: TypeScript, extra export (DOCX), multilingual UI, CV history w/ revert, CI/CD artifact, additional AI (interview feedback) ✅  
- **Privacy**: minimal data, README privacy section, opt-in analytics, erase feature ✅  
- **Forbidden tech**: no agentic codegen; no boilerplate SaaS kits; no one-click apps ✅

---

## 18. 12-Hour Execution Plan

1. **Hour 1–2**: Repo, Docker, Vite + TS, DRF skeleton, Google OAuth callback wired, DB models.
2. **Hour 3–4**: CV form + preview templates; DRF endpoints; save/load; basic PDF.
3. **Hour 5**: Interview: questions, timer, submit, scoring & summary.
4. **Hour 6**: Trainer: quiz engine + result save.
5. **Hour 7**: Import/Export JSON, Dashboard, Settings (locale, erase).
6. **Hour 8**: AI CV generation; prompt templates; guardrails.
7. **Hour 9**: Polish PDF templates, DOCX export (bonus).
8. **Hour 10**: History & revert; i18n (uk/en).
9. **Hour 11**: Tests (E2E for main flows), error states, empty states.
10. **Hour 12**: CI artifact build, demo script, final QA.

---

## 19. Risks & Mitigations

- **OAuth friction** → Use Google test credentials; document redirect URIs.
- **PDF fidelity** → Playwright print CSS; fallback to wkhtmltopdf if needed.
- **LLM latency** → async jobs; concise prompts; caching.
- **Time pressure** → ship minimal vertical slice first, then bonuses.

---

## 20. Folder Blueprint (mono-repo)

```
/frontend
  package.json, vite.config.ts, src/...
/backend
  manage.py, settings.py, apps/..., requirements.txt
/docker
  frontend.Dockerfile, backend.Dockerfile
docker-compose.yml
README.md
```

---

## 21. API Contract (Samples)

```http
POST /cv/generate
Body: { "targetRole": "Frontend Engineer", "tone": "concise", "includeProjects": ["p1","p2"] }
Resp: { "sections": {...}, "notes": "Review and edit before export" }
```

```http
POST /interview/session
Body: { "topic": "frontend-basics" }
Resp: { "id":"...", "questions":[{id:"q1",text:"..."}], "expiresAt": "..." }
```

```http
POST /erase
Resp: { "status": "scheduled" }
```

---

## 22. Acceptance Criteria (Demo-Ready)

- Login with Google works; refresh restores session.
- CV form validates; preview in 2 templates; PDF export downloads; AI generation produces draft.
- Interview runs with timer; on submit shows score & checklist; result visible on Dashboard.
- Trainer quiz stores a result; visible on Dashboard.
- Export/Import JSON works; Erase removes all data.
- UI available in `uk` and `en` (toggle), clean and responsive.

---

## 23. ER Diagram (Mermaid)

```mermaid
erDiagram
  USER ||--o| PROFILE : "has"
  USER ||--o{ CV : "owns"
  USER ||--o{ INTERVIEWSESSION : "has"
  USER ||--o{ TRAINERRESULT : "has"
  USER ||--o{ AUDITEVENT : "has"
  USER ||--o| DELETIONREQUEST : "may have"

  USER {
    uuid id PK
    string email UK
    string full_name
    string avatar_url
    string google_sub UK
    string locale
    boolean consent_analytics
    datetime created_at
    datetime last_login_at
  }

  PROFILE {
    uuid id PK
    uuid user_id FK
    jsonb links
    jsonb education
    jsonb experience
    jsonb skills
    jsonb projects
    text summary
    jsonb preferences
    jsonb history_log
    datetime updated_at
  }

  CV {
    uuid id PK
    uuid user_id FK
    string title
    string template_key
    jsonb sections
    string rendered_pdf_url
    int version
    jsonb changelog
    datetime created_at
    datetime updated_at
  }

  INTERVIEWSESSION {
    uuid id PK
    uuid user_id FK
    jsonb questions
    jsonb answers
    datetime started_at
    datetime ended_at
    int duration_sec
    numeric score
    jsonb checklist
    jsonb ai_feedback
  }

  TRAINERRESULT {
    uuid id PK
    uuid user_id FK
    string module_key
    int attempts
    numeric score
    jsonb metadata
    datetime created_at
  }

  AUDITEVENT {
    uuid id PK
    uuid user_id FK
    string type
    jsonb payload
    datetime ts
  }

  DELETIONREQUEST {
    uuid id PK
    uuid user_id FK
    string status
    datetime requested_at
    datetime processed_at
  }
```

> Arrays/objects are `jsonb` for speed in MVP; normalize later if needed.

---

## 24. Frontend Route Map (Mermaid + Tree)

```mermaid
flowchart LR
  A[App] --> B[Auth]
  A --> C[Dashboard]
  A --> D[CV]
  A --> E[Interview]
  A --> F[Trainer]
  A --> G[Settings]

  D --> D1[CV List]
  D --> D2[CV Editor]
  D --> D3[CV Preview]
  D --> D4[CV History]

  E --> E1[Session Start]
  E --> E2[In-Progress + Timer]
  E --> E3[Result]

  F --> F1[Quiz Start]
  F --> F2[Quiz In-Progress]
  F --> F3[Result]
```

**React Router tree (TS):**
```ts
const router = createBrowserRouter([
  { path: "/auth/callback", element: <AuthCallback /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "cv",
        children: [
          { index: true, element: <CvList /> },
          { path: ":id/edit", element: <CvEditor /> },
          { path: ":id/preview", element: <CvPreview /> },
          { path: ":id/history", element: <CvHistory /> },
        ],
      },
      {
        path: "interview",
        children: [
          { index: true, element: <InterviewStart /> },
          { path: "session/:id", element: <InterviewRun /> },
          { path: "session/:id/result", element: <InterviewResult /> },
        ],
      },
      {
        path: "trainer",
        children: [
          { index: true, element: <TrainerStart /> },
          { path: "attempt/:id", element: <TrainerRun /> },
          { path: "attempt/:id/result", element: <TrainerResult /> },
        ],
      },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
```

---

## 25. CI/CD — GitHub Actions (Monorepo)

> **Goals:** type-check, unit tests, build Docker images, run E2E on docker-compose, upload build artifacts (bonus).  
> **Secrets required:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `LLM_API_KEY` (if E2E uses AI), `REGISTRY`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`.

**File:** `.github/workflows/ci.yml`
```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: app
          POSTGRES_PASSWORD: app
          POSTGRES_DB: app
        ports: [ "5432:5432" ]
        options: >-
          --health-cmd "pg_isready -U app"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    env:
      DATABASE_URL: postgresql://app:app@localhost:5432/app
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install deps
        run: |
          python -m pip install --upgrade pip
          pip install -r backend/requirements.txt
      - name: Lint & typecheck
        run: |
          pip install ruff mypy
          ruff backend --output-format=github
          mypy backend || true  # relaxed for hackathon
      - name: Django tests
        working-directory: backend
        env:
          DATABASE_URL: ${{ env.DATABASE_URL }}
        run: |
          python manage.py migrate --noinput
          pytest -q

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Install & Test
        working-directory: frontend
        run: |
          npm ci
          npm run typecheck
          npm test -- --ci
      - name: Build
        working-directory: frontend
        run: npm run build
      - name: Upload artifact (dist)
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist
          path: frontend/dist

  e2e:
    needs: [backend, frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Build images
        run: |
          docker compose -f docker-compose.yml build
      - name: Start stack
        run: docker compose -f docker-compose.yml up -d
      - name: Install Playwright
        working-directory: frontend
        run: |
          npm ci
          npx playwright install --with-deps
      - name: Run E2E
        working-directory: frontend
        env:
          BASE_URL: http://localhost:5173
        run: npx playwright test
      - name: Upload E2E report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: frontend/playwright-report

  docker-publish:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: [backend, frontend, e2e]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ secrets.REGISTRY }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      - name: Build & push
        run: |
          docker build -t ${{ secrets.REGISTRY }}/app-backend:latest -f docker/backend.Dockerfile .
          docker build -t ${{ secrets.REGISTRY }}/app-frontend:latest -f docker/frontend.Dockerfile .
          docker push ${{ secrets.REGISTRY }}/app-backend:latest
          docker push ${{ secrets.REGISTRY }}/app-frontend:latest
```

**Optional preview env on PRs (ephemeral compose):**
```yaml
# .github/workflows/preview.yml
name: Preview
on:
  pull_request:
    branches: [ main ]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build & Up
        run: |
          docker compose -f docker-compose.yml up -d --build
      - name: Upload frontend build
        uses: actions/upload-artifact@v4
        with:
          name: preview-frontend
          path: frontend/dist
```

---

## 26. Bonus: API Schema Examples (OpenAPI excerpts)

```yaml
components:
  schemas:
    Cv:
      type: object
      properties:
        id: { type: string, format: uuid }
        title: { type: string }
        template_key: { type: string, enum: [clean, two-column] }
        sections: { type: object, additionalProperties: true }
        version: { type: integer }
        changelog: { type: array, items: { type: object } }
```

---

## 27. Demo Script (1–2 min)

1. Login with Google → profile restored.
2. Dashboard → open CV Master → fill fields → switch templates → **Generate with AI** → export **PDF**.
3. Interview → 5–8 Q → timer → submit → score + checklist → Dashboard shows last score.
4. Trainer → quick quiz → result saved.
5. Settings → **Export JSON** → **Erase data** → confirm deletion.
