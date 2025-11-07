You are Claude Code. Generate a complete, production-minded React + TypeScript frontend (Vite) for a "CV Maker + Reviewer + Interview Trainer" web app that implements the MVP described in the provided technical specification (see attached spec file). Focus on modern, minimal, accessible design and ship a developer-ready repo.

High level goals (must do):
- Build a Vite + React + TypeScript SPA with Tailwind CSS and shadcn/ui components.
- Use React Router for navigation.
- Use RTK Query (or React Query) for API calls. Use React Hook Form + zod for forms.
- Implement pages: Auth callback, Dashboard, CV Master (Editor, Preview A/B), Interview (Start, In-progress with countdown timer, Result), Trainer (Quiz flow), Settings (locale toggle en/uk, Export JSON, Erase data).
- Implement UI components: AppLayout, TopNav (logo + nav + auth controls), Cards, Forms, Timers, Modal, Editable field lists for education/experience/skills, Live CV preview.
- Provide two responsive CV templates (Template A: clean single-column; Template B: two-column) with print-friendly A4 styles ready for backend PDF rendering.
- Implement CV "Generate with AI" flow calling `POST /cv/generate` and saving draft into editor.
- Implement PDF export flow: call backend export endpoint `POST /cv/:id/export?format=pdf` and download using signed URL or proxied response.
- Implement Interview flow using `POST /interview/session` to create, `PUT /interview/session/:id/answer` to save answers, and `POST /interview/session/:id/submit` to submit and show score/checklist/ai_feedback.
- Implement Trainer quiz flow with `POST /trainer/attempt` and submit logic.
- Persist user state to backend via provided REST API; use cookie-based session auth (HttpOnly cookie). Implement `GET /me` to fetch user + profile on app start.
- Add i18n scaffolding (react-i18next) with English + Ukrainian.
- Provide tests: unit tests for key components (Jest + Testing Library) and at least one Playwright E2E test (auth -> create CV -> export).
- Containerize: provide Dockerfile for frontend. Provide `npm scripts` for dev, build, lint, test.
- Provide a clear README with setup instructions and required env vars: `VITE_API_ORIGIN`, `VITE_GOOGLE_CLIENT_ID` (if frontend needs it for display), etc.

Integration & backend wiring (explicit):
- All API calls must use a single `API_ORIGIN` env var (e.g., VITE_API_ORIGIN). Use absolute URLs.
- Auth: the frontend should not store tokens in localStorage. It must rely on backend-set HttpOnly session cookie. Implement an `/auth/callback` route that calls backend callback URL (or simply redirect to backend OAuth start) and then fetch `/me`.
- For protected requests, include credentials: `fetch(..., { credentials: 'include' })` or configure RTK Query accordingly.
- CV export & files: expect backend to return signed URLs for stored PDFs; implement download helper to follow signed URL or stream file.
- Implement network error handling, retries for LLM calls (UI: show "Generating..." spinner and a cancel option).

Design improvements (from provided PNG `/mnt/data/Desktop - 1.png`):
- Keep the soft cyan brand accent and large bold hero typography from the mock, but improve spacing, alignment, and responsive scaling.
- Use well-chosen system font stack or Inter; large display font-weight for hero; clear visual hierarchy for headings, subheadings, body text.
- Use a modern minimal palette: neutrals (bg #f3f3f3 / #ffffff), accent cyan (~#7CE7FF or lighter), dark text for headings; ensure WCAG AA contrast.
- Add consistent card shadows, rounded corners, and spacing tokens. Provide accessible focus rings and keyboard navigation.
- Provide a small style token file (colors, spacing, font sizes) and a design README describing visual choices.

Deliverables (exact files & artifacts I expect you to create):
- A new git repo skeleton under `/frontend` with:
  - `package.json`, `vite.config.ts`, `tsconfig.json`
  - `src/main.tsx`, `src/App.tsx`, `src/index.css` (Tailwind)
  - `src/app` (providers: i18n, Redux store / RTK Query provider)
  - `src/pages` (Dashboard, CvList, CvEditor, CvPreview, InterviewStart, InterviewRun, InterviewResult, TrainerStart, TrainerRun, TrainerResult, Settings, AuthCallback)
  - `src/features` (cv/, auth/, interview/, trainer/)
  - `src/components` (TopNav, Card, FieldArrayEditor, CVPreviewRenderer, Timer, Modal, Button)
  - `src/services/api.ts` (RTK Query baseApi configured with credentials:'include' and VITE_API_ORIGIN)
  - `src/styles/design-tokens.ts` and Tailwind config adjustments
  - `README.md` with run commands and environment variables
  - `missing_backend.md` – automatically generated markdown enumerating every backend endpoint, contract, and missing backend features needed for full integration (see below)
  - `Dockerfile` for frontend
  - `tests/` basic unit & Playwright example

Requirements for `missing_backend.md` (generate this file automatically and include in repo):
- List all API endpoints the frontend expects (method, path, required body, response shape, auth requirements). Use the contract style from the spec (include sample HTTP requests/responses).
- Enumerate required backend env/secret keys and services:
  - GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET (for OAuth)
  - LLM_PROVIDER_URL / LLM_API_KEY
  - STORAGE_ENDPOINT / STORAGE_KEY / STORAGE_SECRET and bucket names
  - DB / POSTGRES connection if relevant for dev seed
  - PLAYWRIGHT PDF worker / job queue
- Describe expected behavior for session cookie:
  - HttpOnly, Secure, SameSite=Lax/Strict, path=/
  - CSRF handling expectations for mutating requests (e.g., X-CSRF-Token header).
- Describe expected signed URL format & TTL semantics for downloaded PDFs.
- List missing backend validations, error codes and error shapes (e.g., `{code,message,details?}`).
- Provide fallback behaviors frontend should implement when backend features are missing (e.g., if `POST /cv/:id/export` is missing, offer client-side print preview and `window.print()`).
- Provide open questions for backend team (but do not block): e.g., "Should AI generation be synchronous or queued? Suggested: queued job returning job id and status endpoints."

Important implementation notes for Claude Code (how to implement, not the end-user):
- Keep UI code strictly typed. Provide types for API responses in `src/types/api.ts` derived from the API contract.
- Use feature-based folder layout. Keep components small and testable.
- Mock the backend during dev with a lightweight mock server (msw) that implements the API contract so reviewers can run the frontend without a real backend.
- Create a `dev:mock` npm script that runs the app with MSW mocking the important flows (auth cookie simulation, sample profile, CV generate, interview questions).
- Add E2E Playwright test that uses the mock API and exercises the main happy path: login -> create CV -> generate via AI -> export PDF -> run interview -> view result.
- Provide clear TODO comments in code where backend details are required (e.g., exact cookie names, exact field names for CV sections).

Design & Accessibility:
- Use semantic HTML, ARIA attributes where needed. Ensure keyboard accessibility across forms & timers.
- Create print CSS for the CV templates.

Testing & CI:
- Include basic GitHub Actions workflow skeleton for frontend tests/build (typecheck -> test -> build artifact).

Output format:
- Produce the full repo scaffold and file contents (or a zip) ready to be committed. If producing a compressed artifact, include a link. Also produce `missing_backend.md` describing every missing backend piece and exact sample request/response shapes for each endpoint the frontend calls.
- Also produce a short design brief README (DESIGN_DECISIONS.md) listing tokens, fonts, spacing, and how the PNG mock was improved.

Important: Use the attached technical specification as canonical requirements and double-check any assumption against it. Reference: the uploaded spec file. :contentReference[oaicite:1]{index=1}

Design asset: improve the uploaded PNG located at `/mnt/data/Desktop - 1.png` — produce improved mockups (Figma-like static assets or exported PNGs) for:
- Landing / Dashboard hero
- CV Editor + Preview layout
- Interview run screen (timer + question)
- Trainer quiz screen

Finally, create `missing_backend.md` that lists, for each missing endpoint or required backend capability, minimal example requests, response JSON schema, authentication, and whether the frontend will provide a graceful fallback. Be explicit and machine-readable where possible.

Do not ask clarifying questions — implement full best-effort frontend and generate `missing_backend.md` and `DESIGN_DECISIONS.md`. If you cannot implement something, add a clear TODO section in `missing_backend.md` explaining why and how backend should implement it.
