# Backend (Django)
## Локальний запуск
```bash
# Створення віртуального середовища
python -m venv venv
source venv/bin/activate
# Встановлення залежностей
pip install -r requirements.txt
# Міграції
python manage.py migrate
# Запуск сервера
python manage.py runserver
```
## Головні команди
```bash
# Створення суперюзера
python manage.py createsuperuser
# Django shell
python manage.py shell
# Тести
pytest
# Міграції
python manage.py makemigrations
python manage.py migrate
```
## Структура
- `authz/` - Автентифікація (Google OAuth)
- `profiles/` - Профілі + CV
- `interview/` - Mock interviews
- `trainer/` - Skills training
- `files/` - File management
- `config/` - Django налаштування
Детальніше: [../DOCUMENTATION.md](../DOCUMENTATION.md)
