# 🎓 HIRELY - AI-Powered Career Platform

**Your complete career preparation toolkit with CV management, interview practice, and skills training.**

[![Status](https://img.shields.io/badge/status-ready-success)](.)
[![Tests](https://img.shields.io/badge/tests-7%2F7%20passing-brightgreen)](.)
[![Django](https://img.shields.io/badge/django-4.2+-blue)](.)
[![React](https://img.shields.io/badge/react-18+-blue)](.)

---

## ✨ Features

### 📄 CV Management
- **Create Professional CVs** - Form-based editor with live preview
- **Export to PDF & DOCX** - Download in professional or editable formats
- **Multiple Templates** - Clean and two-column layouts
- **Version Tracking** - Full changelog for every CV update

### 🎤 Interview Practice
- **AI-Powered Feedback** - Get intelligent feedback on your answers
- **18 Interview Questions** - Across frontend, backend, and algorithms
- **Time Tracking** - Monitor your response times
- **Session History** - Review and improve over time

### 📚 Skills Trainer
- **47 Quiz Questions** - Across 5 different categories
- **Randomized Tests** - Fresh experience every time
- **Instant Feedback** - Learn as you go
- **Multiple Categories** - Frontend, backend, algorithms, system design, behavioral

### 🔒 Privacy & Security
- **Google OAuth** - Secure authentication
- **GDPR Compliant** - Export and delete your data anytime
- **Audit Logging** - Track all important actions
- **Data Ownership** - You control your information

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip and npm

### 1. Clone & Setup
```bash
git clone <repository-url>
cd project-repo
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

- **[COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)** - Full setup instructions & API docs
- **[ALL_APPS_CONNECTED.md](ALL_APPS_CONNECTED.md)** - Integration details
- **[CV_EXPORT_COMPLETE.md](CV_EXPORT_COMPLETE.md)** - CV export feature guide
- **[CV_EXPORT_IMPLEMENTATION.md](CV_EXPORT_IMPLEMENTATION.md)** - Technical details

---

## 🛠️ Technology Stack

### Backend
- **Django 4.2+** - Web framework
- **Django REST Framework** - API
- **WeasyPrint** - PDF generation
- **python-docx** - DOCX creation
- **Groq/LLaMA** - AI integration (optional)
- **PostgreSQL/SQLite** - Database

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation

---

## 🔧 Development

### Run Tests
```bash
# Backend
cd backend
python test_startup.py        # Comprehensive test
python test_cv_export.py      # CV export test
python manage.py check        # Django check
pytest                        # Unit tests

# Frontend
cd frontend
npm run build                 # Type check
npm test                      # Run tests
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

