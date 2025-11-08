# 🚀 Інструкція з Deploy на Render
## ✅ Перевірка готовності
Ваш проєкт **ГОТОВИЙ** до deploy! Всі необхідні файли створені:
### Файли для deploy:
- ✅ `render.yaml` - конфігурація для Render
- ✅ `backend/build.sh` - скрипт збірки бекенду
- ✅ `backend/requirements.txt` - оновлено (gunicorn, psycopg2, whitenoise)
- ✅ `.env.example` - приклад змінних середовища
- ✅ `backend/config/settings.py` - налаштовано для продакшену
- ✅ Health check endpoint - `/api/health/`
## 🎯 Швидкий старт
### Крок 1: Підготовка коду
```bash
# Перевірте статус git
git status
# Додайте всі зміни
git add .
# Зробіть commit
git commit -m "Готово до deploy на Render"
# Запуште на GitHub
git push origin main
```
### Крок 2: Створення сервісів на Render
1. **Зайдіть на Render**: https://dashboard.render.com
2. **Натисніть "New +"** → **"Blueprint"**
3. **Підключіть GitHub репозиторій**
4. Render автоматично знайде `render.yaml` і створить:
   - PostgreSQL базу даних
   - Django бекенд
   - React фронтенд
### Крок 3: Налаштування змінних середовища
#### Для Backend (hirely-backend):
**Обов'язкові змінні:**
```
ALLOWED_HOSTS=your-backend-app.onrender.com,localhost
CORS_ALLOWED_ORIGINS=https://your-frontend-app.onrender.com
WEB_ORIGIN=https://your-frontend-app.onrender.com
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
LLM_API_KEY=ваш-groq-api-key
```
**Автоматичні змінні (вже налаштовані в render.yaml):**
- `SECRET_KEY` - генерується автоматично
- `DATABASE_URL` - з'єднання з PostgreSQL
- `DEBUG=False`
- `PYTHON_VERSION=3.12.0`
#### Для Frontend (hirely-frontend):
```
VITE_API_ORIGIN=https://your-backend-app.onrender.com
```
### Крок 4: Оновіть URL після deploy
Після першого deploy:
1. Відкрийте backend service → Settings
2. Скопіюйте URL (наприклад: `https://hirely-backend-abc123.onrender.com`)
3. Оновіть frontend змінні:
   ```
   VITE_API_ORIGIN=https://hirely-backend-abc123.onrender.com
   ```
4. Скопіюйте frontend URL (наприклад: `https://hirely-frontend-xyz789.onrender.com`)
5. Оновіть backend змінні:
   ```
   CORS_ALLOWED_ORIGINS=https://hirely-frontend-xyz789.onrender.com
   WEB_ORIGIN=https://hirely-frontend-xyz789.onrender.com
   ALLOWED_HOSTS=hirely-backend-abc123.onrender.com,localhost
   ```
### Крок 5: Налаштуйте Google OAuth
1. Перейдіть: https://console.cloud.google.com
2. Виберіть проєкт
3. Credentials → OAuth 2.0 Client IDs
4. Додайте **Authorized JavaScript origins**:
   ```
   https://hirely-frontend-xyz789.onrender.com
   https://hirely-backend-abc123.onrender.com
   ```
5. Додайте **Authorized redirect URIs**:
   ```
   https://hirely-backend-abc123.onrender.com/api/auth/google/callback
   ```
## 🔍 Перевірка після deploy
### 1. Перевірте health endpoint:
```
https://your-backend-app.onrender.com/api/health/
```
Має повернути: `{"status": "ok", "service": "hirely-backend"}`
### 2. Перевірте фронтенд:
Відкрийте `https://your-frontend-app.onrender.com`
### 3. Перевірте функції:
- ✅ Google авторизація
- ✅ Створення CV
- ✅ Експорт у PDF/DOCX
- ✅ Interview сесії
- ✅ Skills Trainer
## ⚠️ Важливо знати
### Безкоштовний план Render:
- **Автоматичне вимкнення** після 15 хв неактивності
- **Перший запит** може зайняти 30-60 сек (поки сервіс "просинається")
- **База даних** видаляється після 90 днів неактивності
### Щоб тримати сервіс активним:
Використайте [UptimeRobot](https://uptimerobot.com) або [Cron-Job.org](https://cron-job.org):
- Пінгуйте кожні 10 хв: `https://your-backend.onrender.com/api/health/`
## 🐛 Вирішення проблем
### Backend не запускається:
1. Перевірте логи в Render Dashboard
2. Переконайтесь, що всі змінні середовища налаштовані
3. Перевірте, що DATABASE_URL підключений
### CORS помилки:
```bash
# Переконайтесь, що в backend:
CORS_ALLOWED_ORIGINS=https://точна-адреса-фронтенду.onrender.com
# І у frontend:
VITE_API_ORIGIN=https://точна-адреса-бекенду.onrender.com
```
### Frontend показує 404:
1. Перевірте що в Render → Settings → Redirects/Rewrites є правило:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
### Google OAuth не працює:
1. Перевірте redirect URIs в Google Cloud Console
2. Переконайтесь, що використовуєте HTTPS
3. URL мають бути точними (без "/" в кінці)
## 📊 Моніторинг
### Логи:
- Render Dashboard → ваш сервіс → Logs
- Логи зберігаються 7 днів на безкоштовному плані
### Автоматичний deploy:
Render автоматично робить deploy при push в GitHub:
```bash
git add .
git commit -m "Оновлення"
git push origin main
# Deploy запуститься автоматично!
```
## 🎉 Готово!
Ваш застосунок має бути онлайн:
- **Frontend**: https://your-frontend.onrender.com
- **Backend API**: https://your-backend.onrender.com
- **Admin панель**: https://your-backend.onrender.com/admin
## 📞 Потрібна допомога?
- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Django on Render**: https://render.com/docs/deploy-django
---
**Успішного deploy! 🚀**
