# Hirely - Future of Work & Careers Platform

A comprehensive web application helping students and job seekers with CV building, interview preparation, and skills training.

## Features

✅ **Google OAuth Authentication** - Secure login with Google  
✅ **CV Master** - Create professional CVs with multiple templates and AI generation  
✅ **Interview Prep** - Practice with timed mock interviews and get instant feedback  
✅ **Skills Trainer** - Test your knowledge with interactive quizzes  
✅ **Multi-language Support** - English and Ukrainian (українська)  
✅ **Data Privacy** - Export your data and complete account deletion (GDPR-compliant)

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router (routing)
- React Query (data fetching)
- Tailwind CSS (styling)
- react-i18next (internationalization)
- Lucide React (icons)

### Backend
- Django 4.2 + Django REST Framework
- PostgreSQL (database)
- Google OAuth 2.0
- Docker & Docker Compose

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd project-repo
```

2. Create `.env` file (optional, for OAuth):
```bash
# .env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
LLM_API_KEY=your-llm-key
```

3. Start the application:
```bash
docker compose up --build
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Project Structure

```
project-repo/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── pages/     # Page components
│   │   ├── components/ # Reusable UI components
│   │   ├── services/  # API clients
│   │   └── i18n/      # Translations
│   └── package.json
├── backend/           # Django backend
│   ├── authz/        # Authentication & authorization
│   ├── profiles/     # User profiles
│   ├── interview/    # Interview module
│   ├── trainer/      # Skills trainer module
│   ├── files/        # File handling
│   └── config/       # Django settings
└── docker-compose.yml
```

## Features Overview

### 🎯 Dashboard
- Overview of all modules
- Quick access to CV, Interview, and Trainer
- Export and delete account options

### 📄 CV Master
- Professional CV form with validation
- Live preview with 2 templates
- AI-powered CV generation (coming soon)
- Export to PDF (coming soon)
- Field-level history and revert (coming soon)

### 💬 Interview Preparation
- Mock interview with 5-8 questions
- Timer for each question
- Auto-save answers
- Score and checklist feedback
- Results saved to profile

### 🏆 Skills Trainer
- Interactive quizzes
- Multiple choice questions
- Progress tracking
- Results history
- Score calculation

### ⚙️ Settings
- Language switcher (EN/UK)
- Privacy controls
- Export all data (JSON)
- Delete account (GDPR-compliant)

## API Endpoints

### Authentication
- `POST /api/auth/google/start` - Start OAuth flow
- `GET /api/auth/google/callback` - OAuth callback
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### CV
- `GET /api/cv` - List CVs
- `POST /api/cv` - Create CV
- `GET /api/cv/:id` - Get CV
- `PUT /api/cv/:id` - Update CV
- `POST /api/cv/generate` - AI generate CV

### Interview
- `POST /api/interview/session` - Start session
- `PUT /api/interview/session/:id/answer` - Save answer
- `POST /api/interview/session/:id/submit` - Submit session

### Trainer
- `POST /api/trainer/attempt` - Start quiz
- `POST /api/trainer/attempt/:id/submit` - Submit answers

## Privacy & Data Protection

This application follows GDPR principles:
- Minimal data collection
- Transparent data usage
- User control over their data
- Right to export data (JSON format)
- Right to be forgotten (complete deletion)
- Analytics opt-in only

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

### E2E Tests (Coming Soon)
```bash
cd frontend
npx playwright test
```

## Contributing

This is a hackathon project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

See LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.

---

**Built for the Future of Work & Careers Hackathon** 🚀

