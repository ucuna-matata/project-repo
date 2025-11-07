#!/bin/bash

# Скрипт для перевірки з'єднання frontend та backend

echo "🔍 Перевірка з'єднання frontend та backend..."
echo ""

# Кольори для виводу
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Перевірка backend
echo "1️⃣  Перевірка Backend на http://localhost:8000..."
if curl -s http://localhost:8000/api/healthz/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend працює!${NC}"
else
    echo -e "${RED}✗ Backend не відповідає. Переконайтеся що він запущений.${NC}"
    echo -e "${YELLOW}Запустіть: cd backend && python manage.py runserver${NC}"
fi

echo ""

# Перевірка frontend
echo "2️⃣  Перевірка Frontend на http://localhost:5173..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend працює!${NC}"
else
    echo -e "${RED}✗ Frontend не відповідає. Переконайтеся що він запущений.${NC}"
    echo -e "${YELLOW}Запустіть: cd frontend && npm run dev${NC}"
fi

echo ""

# Перевірка CORS
echo "3️⃣  Перевірка CORS налаштувань..."
CORS_CHECK=$(curl -s -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     -I http://localhost:8000/api/auth/me 2>&1 | grep -i "access-control-allow-origin")

if [ ! -z "$CORS_CHECK" ]; then
    echo -e "${GREEN}✓ CORS налаштовано правильно!${NC}"
else
    echo -e "${RED}✗ CORS не налаштовано або backend не працює${NC}"
fi

echo ""

# Перевірка .env файлів
echo "4️⃣  Перевірка конфігураційних файлів..."

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ backend/.env існує${NC}"

    # Перевірка важливих змінних
    if grep -q "GOOGLE_CLIENT_ID" backend/.env; then
        echo -e "${GREEN}  ✓ GOOGLE_CLIENT_ID налаштовано${NC}"
    else
        echo -e "${YELLOW}  ⚠ GOOGLE_CLIENT_ID не знайдено${NC}"
    fi

    if grep -q "CORS_ALLOWED_ORIGINS" backend/.env; then
        echo -e "${GREEN}  ✓ CORS_ALLOWED_ORIGINS налаштовано${NC}"
    else
        echo -e "${YELLOW}  ⚠ CORS_ALLOWED_ORIGINS не знайдено${NC}"
    fi
else
    echo -e "${RED}✗ backend/.env не знайдено${NC}"
    echo -e "${YELLOW}Створіть файл backend/.env на основі backend/.env.example${NC}"
fi

echo ""

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓ frontend/.env існує${NC}"

    if grep -q "VITE_API_ORIGIN" frontend/.env; then
        echo -e "${GREEN}  ✓ VITE_API_ORIGIN налаштовано${NC}"
    else
        echo -e "${YELLOW}  ⚠ VITE_API_ORIGIN не знайдено${NC}"
    fi
else
    echo -e "${RED}✗ frontend/.env не знайдено${NC}"
    echo -e "${YELLOW}Створіть файл frontend/.env з VITE_API_ORIGIN=http://localhost:8000${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Підсумок:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin"
echo ""
echo "📚 Детальна документація: SETUP.md"
echo ""

