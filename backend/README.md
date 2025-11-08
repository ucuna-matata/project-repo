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

## Скрипти обслуговування

### Тестування видалення CV
```bash
# Перевірка логіки видалення дублікатів
python test_cv_deletion.py
```

### Очищення дублікатів CV
```bash
# Dry-run режим (показує що буде видалено, але не видаляє)
python cleanup_duplicate_cvs.py

# Виконання очищення (видаляє дублікати)
python cleanup_duplicate_cvs.py --execute
```

## Структура
- `authz/` - Автентифікація (Google OAuth)
- `profiles/` - Профілі + CV
- `interview/` - Mock interviews
- `trainer/` - Skills training
- `files/` - File management
- `config/` - Django налаштування

Детальніше: [../DOCUMENTATION.md](../DOCUMENTATION.md)
Виправлення дублікатів CV: [CV_DELETION_FIX.md](CV_DELETION_FIX.md)

