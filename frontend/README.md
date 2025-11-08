# Frontend (React + Vite)
## Локальний запуск
```bash
# Встановлення залежностей
npm install
# Запуск dev сервера
npm run dev
# Build для production
npm run build
```
## Головні команди
```bash
# Development
npm run dev              # Запуск dev server
npm run build            # Production build
npm run preview          # Preview production build
# Testing
npm run test:unit        # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
# Linting
npm run lint             # ESLint
npm run typecheck        # TypeScript check
```
## Структура
- `src/pages/` - Сторінки додатку
- `src/components/` - React компоненти
- `src/services/` - API клієнт
- `src/i18n/` - Переклади (EN/UK)
- `src/lib/` - Утиліти
## Технології
- React 18 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Query
- React Router
- React Hook Form
Детальніше: [../DOCUMENTATION.md](../DOCUMENTATION.md)
