# 🎓 HIRELY - AI-Powered Career Platform

**Your complete career preparation toolkit with CV management, interview practice, and skills training.**

[![Status](https://img.shields.io/badge/status-production%20ready-success)](.)
[![Integration](https://img.shields.io/badge/integration-complete-brightgreen)](.)
[![Django](https://img.shields.io/badge/django-5.2+-blue)](.)
[![React](https://img.shields.io/badge/react-18+-blue)](.)
[![TypeScript](https://img.shields.io/badge/typescript-5+-blue)](.)

---

## ✨ Features

### 📄 CV Management
- **Create Professional CVs** - Form-based editor with live preview
- **Export to PDF & DOCX** - Download in professional or editable formats
- **Multiple Templates** - Clean and two-column layouts
- **Version Tracking** - Full changelog for every CV update
- **AI Generation** - Generate CVs with AI assistance

### 🎤 Interview Practice
- **Multiple Topics** - Frontend, backend, algorithms, system design, behavioral
- **Real-time Sessions** - Create interview sessions with backend tracking
- **Answer Tracking** - Save your answers with time spent
- **Instant Feedback** - Get intelligent feedback on your responses
- **Session History** - Review past interviews and track progress

### 📚 Skills Trainer
- **Dynamic Categories** - Loaded from backend in real-time
- **Random Questions** - 10+ questions per category, randomized each time
- **47+ Quiz Questions** - Across 5 categories with more coming
- **Instant Scoring** - See results immediately
- **Progress Tracking** - All results saved to backend

### 🔒 Privacy & Security
- **Google OAuth** - Secure authentication flow
- **GDPR Compliant** - Export and delete your data anytime
- **Audit Logging** - Track all important actions
- **CSRF Protection** - Secure against cross-site attacks
- **Data Ownership** - You control your information

---

## 🎯 What's New - Full Backend Integration ✅

**All backend capabilities are now fully connected to the frontend!**

### New Features:
- ✅ **Real-time Trainer** - Categories and questions loaded from backend
- ✅ **Live Interview Sessions** - Full CRUD with server persistence
- ✅ **React Query Hooks** - 25+ hooks for easy API integration
- ✅ **Type-safe Services** - Full TypeScript support
- ✅ **Automatic Caching** - Smart data fetching and invalidation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Loading States** - Beautiful loading indicators

### API Coverage:
- 🔐 Authentication (4 endpoints)
- 👤 Profile & CV (8 endpoints)
- 🎤 Interview (5 endpoints)
- 📚 Trainer (6 endpoints)
- 📎 Files (3 endpoints)
- 🛡️ GDPR (3 endpoints)

**Total: 29+ endpoints fully integrated!**

---

## 🚀 Quick Start

See **[QUICK_START.md](./QUICK_START.md)** for detailed setup instructions.

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip and npm

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
echo "VITE_API_ORIGIN=http://localhost:8000" > .env
npm run dev
```

### 2. Backend Setup
```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. Configure Environment
Create `backend/.env`:
```env
SECRET_KEY=your-secret-key
DEBUG=True
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GROQ_API_KEY=your-groq-key  # Optional
```

Create `frontend/.env`:
```env
VITE_API_ORIGIN=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### 5. Run Tests (Optional but Recommended)
```bash
cd backend
python test_startup.py  # Should show 7/7 tests passed
```

### 6. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
source ../.venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Open Application
Visit: **http://localhost:5173**

---

## 📊 Test Results

```
✅ PASS  Apps Registered
✅ PASS  Database Models  
✅ PASS  URL Patterns
✅ PASS  CV Export (PDF & DOCX)
✅ PASS  Interview Integration
✅ PASS  Trainer Integration
✅ PASS  API Endpoints

Results: 7/7 tests passed
```

---

## 📁 Project Structure

```
project-repo/
├── backend/                 # Django REST API
│   ├── authz/              # Authentication & GDPR
│   ├── profiles/           # Profiles & CV management
│   │   ├── services/       # CV export service
│   │   └── templates/      # PDF/DOCX templates
│   ├── interview/          # Interview practice
│   ├── trainer/            # Quiz system
│   └── files/              # File management
├── frontend/               # React + TypeScript
│   └── src/
│       ├── pages/          # Route components
│       ├── components/     # Reusable components
│       └── services/       # API integration
└── docs/                   # Comprehensive documentation
```

---

## 🎯 What You Can Do

1. ✅ Create and manage multiple CVs
2. ✅ Export CVs as PDF or DOCX
3. ✅ Practice interviews with AI feedback
4. ✅ Take quizzes across 5 categories
5. ✅ Track your progress over time
6. ✅ Export all your data (GDPR)
7. ✅ Customize your profile

---

## 📚 Documentation

### 📖 Main Guides
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup and common commands
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Backend-Frontend integration overview
- **[frontend/INTEGRATION_COMPLETE.md](./frontend/INTEGRATION_COMPLETE.md)** - Detailed integration guide
- **[frontend/API_SERVICES.md](./frontend/API_SERVICES.md)** - Complete API documentation

### 📄 Technical Docs
- **[COMPLETE_SETUP_GUIDE.md](./COMPLETE_SETUP_GUIDE.md)** - Full setup instructions
- **[ALL_APPS_CONNECTED.md](./ALL_APPS_CONNECTED.md)** - App integration details
- **[CV_EXPORT_COMPLETE.md](./CV_EXPORT_COMPLETE.md)** - CV export feature guide

---

## 🛠️ Technology Stack

### Backend
- **Django 5.2+** - Web framework
- **Django REST Framework** - RESTful API
- **django-cors-headers** - CORS support
- **WeasyPrint** - PDF generation
- **python-docx** - DOCX creation
- **Groq/LLaMA** - AI integration (optional)
- **SQLite** - Database (PostgreSQL ready)

### Frontend
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **React Query (TanStack Query)** - Data fetching & caching
- **React Router** - Client-side routing
- **i18next** - Internationalization

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pytest** - Backend testing
- **Vitest** - Frontend testing
- **Playwright** - E2E testing

---

## 🎨 Features in Detail

### CV Management
```typescript
import { useCVs, useCreateCV, useExportCV } from './hooks/useApi';

function CVManager() {
  const { data: cvs } = useCVs();
  const createCV = useCreateCV();
  const exportCV = useExportCV();
  
  return (
    <div>
      {cvs?.map(cv => (
        <button onClick={() => exportCV.mutate({ id: cv.id, format: 'pdf' })}>
          Export {cv.title}
        </button>
      ))}
    </div>
  );
}
```

### Interview Practice
```typescript
import { useCreateInterviewSession } from './hooks/useApi';

function Interview() {
  const createSession = useCreateInterviewSession();
  
  const start = async () => {
    const session = await createSession.mutateAsync({ 
      topic: 'frontend-basics' 
    });
    // Session created with 5 questions!
  };
}
```

### Skills Training
```typescript
import { useTrainerCategories, useTrainerQuestions } from './hooks/useApi';

function Trainer() {
  const { data: categories } = useTrainerCategories();
  const { data: questions } = useTrainerQuestions('algorithms', 10);
  
  // Real-time questions from backend!
}
```

---

## 🔧 Development

### Run Tests
```bash
# Backend
cd backend
python test_startup.py        # Comprehensive test
pytest                        # Unit tests
python manage.py check        # Django checks

# Frontend
cd frontend
npm test                      # Vitest tests
npm run build                 # Type check
npm run lint                  # ESLint
```

### Code Quality
```bash
# Backend
black .                       # Format code
ruff check .                  # Lint code
mypy .                        # Type check

# Frontend
npm run lint                  # ESLint
npm run format                # Prettier
```

---

## 📡 API Endpoints

### Core Endpoints
- `POST /api/auth/google/` - Login
- `GET /api/auth/me/` - Current user
- `GET/PUT /api/profile/` - User profile
- `GET/POST /api/cvs/` - CVs
- `GET /api/cvs/<id>/export/?format=pdf|docx` - Export CV
- `POST /api/interview/sessions` - Start interview
- `GET /api/trainer/questions/<category>/` - Get quiz

Full API documentation in [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)

---

## 🔒 Security

- ✅ Google OAuth authentication
- ✅ CSRF protection
- ✅ Session management
- ✅ Authorization checks
- ✅ Audit logging
- ✅ GDPR compliance

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

[MIT License](LICENSE)

---

## 🆘 Support

### Quick Help
```bash
# Run comprehensive test
./quick-start.sh

# Check backend
cd backend && python manage.py check

# Check frontend
cd frontend && npm run build
```

### Common Issues

**"Module not found" errors:**
```bash
pip install -r backend/requirements.txt
cd frontend && npm install
```

**"Port already in use":**
- Backend: Change port in `manage.py runserver 8001`
- Frontend: Change port in `vite.config.ts`

**"Authentication failed":**
- Verify Google OAuth credentials
- Check `.env` files are configured
- Ensure CORS settings are correct

### Documentation
See comprehensive guides in the `docs/` folder or root-level `.md` files.

---

## 🎉 Status: Ready to Use!

All apps connected ✅  
All tests passing ✅  
CV export working ✅  
Documentation complete ✅  

**Start building your career today!** 🚀

---

## 📈 Stats

- **5 Backend Apps** - All connected
- **7 Frontend Routes** - All working
- **18 Interview Questions** - Ready to practice
- **47 Quiz Questions** - Test your skills
- **7/7 Tests Passed** - Fully validated

---

**Made with ❤️ for career builders everywhere**

*Last Updated: November 8, 2025*

