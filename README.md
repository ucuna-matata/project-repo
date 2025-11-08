# Hirely

AI-powered career assistant helping students build their professional future.

Hirely — це веб-платформа, яка допомагає студентам створювати якісні резюме, тренуватись перед співбесідами та розвивати кар’єрні навички.  
Проєкт створено під час хакатону як MVP-рішення з фокусом на UX, мультимовність і AI-інтеграцію.

---

## Features

- CV Master — створення та редагування резюме з кількома шаблонами  
- Interview Prep — симулятор співбесід із порадами від AI  
- Skills Trainer — короткі тести для перевірки знань  
- Dashboard & Settings — управління акаунтом, мовою та даними  
- Multilanguage support — англійська та українська  
- Data export — збереження результатів у форматі JSON

---

## Tech Stack

**Frontend**
- React 18  
- TypeScript  
- Vite  
- TailwindCSS  
- React Router  
- React Query  
- i18next  
- Lucide React Icons  

**Backend (API Integration)**
- REST API з підтримкою OAuth 2.0 (Google Sign-In)
- HTTP-only cookie session (auth callback)
- JSON responses для CV, Interview, Trainer modules

---

## Project Structure

```

src/
├── components/
│    ├── cv/
│    ├── trainer/
│    ├── common/
│    └── ui/
├── hooks/
├── pages/
│    ├── Login.tsx
│    ├── Dashboard.tsx
│    ├── CVList.tsx
│    ├── CVMaster.tsx
│    ├── Interview.tsx
│    ├── InterviewResults.tsx
│    ├── Trainer.tsx
│    ├── Settings.tsx
│    └── AuthCallback.tsx
├── services/
│    ├── api.ts
│    ├── auth.ts
│    ├── profileService.ts
│    └── interviewService.ts
├── schemas/
├── i18n/config.ts
├── App.tsx
└── main.tsx

````

---

## Setup & Development

### 1. Clone the repository
```bash
git clone https://github.com/ucuna-matata/project-repo.git
cd project-repo
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run in development mode

```bash
npm run dev
```

Application runs at **[http://localhost:5173](http://localhost:5173)**

---

## Multilanguage

* Default language: English
* Supported: `en`, `uk`
* Language is stored in `localStorage` and can be changed from **Settings → Language**

---

## Key Pages

| Route        | Description                            |
| ------------ | -------------------------------------- |
| `/login`     | Google OAuth sign-in                   |
| `/dashboard` | Overview of user’s activity            |
| `/cv-list`   | Manage and export CVs                  |
| `/cv-master` | Build or edit CV                       |
| `/interview` | AI-powered interview simulator         |
| `/trainer`   | Knowledge quizzes                      |
| `/settings`  | Profile, language, export & data erase |

---

## Architecture

React App → REST API → Database (Backend Service)

Мультимовність реалізовано через `react-i18next`, стан — через `React Query`.
Компонентний підхід, чиста структура, чітке розділення бізнес-логіки (`services`, `hooks`) від UI (`components`, `pages`).

---

## Authors

**Team:** ucuna-matata
Created during Hackathon CV 2025.
Open for further development and collaboration.

---

## License

UCU © 2025 UCUna matata
цей варіант виглядає акуратно і зрозуміло на GitHub — без жодних емодзі, кольорових тегів чи надмірного форматування.  
якщо хочеш, я можу адаптувати коротку англомовну версію (1 сторінка, concise summary для README.md у production).
```
