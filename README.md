# Hirely

AI-powered career assistant helping students build their professional future.

Hirely is a web platform designed to help students create professional resumes, prepare for interviews, and develop essential career skills.  
The project was built during a hackathon as an MVP focusing on user experience, multilingual support, and AI integration.

---

## Features

- CV Master — create and edit resumes using multiple templates  
- Interview Prep — mock interview simulator with AI feedback  
- Skills Trainer — short quizzes to test and improve knowledge  
- Dashboard & Settings — manage account, language, and data  
- Multilanguage support — English and Ukrainian  
- Data export — save results in JSON format

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
- REST API with OAuth 2.0 (Google Sign-In)
- HTTP-only cookie session (auth callback)
- JSON responses for CV, Interview, and Trainer modules

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

The application will be available at **[http://localhost:5173](http://localhost:5173)**

---

## Multilanguage

* Default language: English
* Supported languages: `en`, `uk`
* The selected language is saved in `localStorage` and can be changed in **Settings → Language**

---

## Key Pages

| Route        | Description                            |
| ------------ | -------------------------------------- |
| `/login`     | Google OAuth sign-in                   |
| `/dashboard` | Overview of user activity              |
| `/cv-list`   | Manage and export CVs                  |
| `/cv-master` | Build or edit CV                       |
| `/interview` | AI-powered interview simulator         |
| `/trainer`   | Knowledge and skill quizzes            |
| `/settings`  | Profile, language, export & data erase |

---

## Architecture

**React App → REST API → Database (Backend Service)**

Multilanguage is implemented with `react-i18next`, and data management is handled via `React Query`.
The project follows a clean component-based architecture, with business logic separated into `services` and `hooks`, and presentation handled by `components` and `pages`.

---

## Authors

**Team:** ucuna-matata
 Nazar Mykhailyshchuk, Tanya Moroz, Daryna Nychyporuk
---

## License

UCU © 2025 UCUna Matata

Would you like me to make a short production-ready version too (a 10–12 line README summary like most public GitHub projects use)? It’s ideal if you plan to make the repo public.
```
