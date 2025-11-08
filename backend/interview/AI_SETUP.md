# AI Interview Assistant Setup Guide

## Огляд

Цей модуль надає AI-помічника для проведення mock-інтерв'ю з використанням Groq API (Llama 3).

## Функціонал

### 1. AI Підказки під час інтерв'ю
- Користувач може запитати підказку для поточного питання
- AI аналізує питання та поточну відповідь користувача
- Надає корисні підказки без розкриття повної відповіді

### 2. AI Фідбек після завершення інтерв'ю
- Автоматичний аналіз всіх відповідей
- Виділення сильних сторін (strengths)
- Визначення слабких місць (weaknesses)
- Практичні поради для покращення (tips)
- Загальна оцінка (overall_assessment)

## Налаштування

### 1. Встановлення залежностей

Переконайтеся, що у файлі `requirements.txt` є:
```
groq==0.33.0
python-dotenv==1.2.1
```

Встановіть залежності:
```bash
pip install -r requirements.txt
```

### 2. Налаштування API ключа

1. Отримайте API ключ від Groq:
   - Зареєструйтеся на https://console.groq.com/
   - Створіть новий API ключ
   - Скопіюйте ключ

2. Додайте ключ до файлу `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Перевірка роботи

Запустіть Django development server:
```bash
python manage.py runserver
```

## API Endpoints

### 1. Отримання AI підказки
```
POST /api/interview/sessions/{session_id}/hint/
```

**Request Body:**
```json
{
  "question_id": "fe1",
  "current_answer": "User's current answer text..."
}
```

**Response:**
```json
{
  "hint": "Consider the scope differences between var, let, and const..."
}
```

### 2. Автоматичний фідбек при submit
```
POST /api/interview/sessions/{session_id}/submit/
```

**Response включає:**
```json
{
  "id": "uuid",
  "status": "completed",
  "score": 85.5,
  "ai_feedback": {
    "strengths": [
      "Clear explanation of concepts",
      "Good use of examples"
    ],
    "weaknesses": [
      "Could provide more technical details",
      "Missing some edge cases"
    ],
    "tips": [
      "Practice explaining with real-world scenarios",
      "Review advanced concepts"
    ],
    "overall_assessment": "Good performance overall..."
  }
}
```

## Використання у Frontend

### 1. Hook для отримання підказки

```typescript
import { useGetInterviewHint } from '../hooks/useApi';

const getHint = useGetInterviewHint();

// Отримання підказки
const handleGetHint = async () => {
  const result = await getHint.mutateAsync({
    sessionId: 'current-session-id',
    questionId: 'fe1',
    currentAnswer: 'My current answer...'
  });
  console.log(result.hint);
};
```

### 2. Відображення AI фідбека

```typescript
{session?.ai_feedback && (
  <div>
    <h3>Strengths</h3>
    <ul>
      {session.ai_feedback.strengths.map(s => <li>{s}</li>)}
    </ul>
    
    <h3>Areas for Improvement</h3>
    <ul>
      {session.ai_feedback.weaknesses.map(w => <li>{w}</li>)}
    </ul>
    
    <h3>Tips</h3>
    <ul>
      {session.ai_feedback.tips.map(t => <li>{t}</li>)}
    </ul>
  </div>
)}
```

## Налаштування параметрів AI

У файлі `llama_api.py` можна налаштувати:

### 1. Модель
```python
model="llama3-70b-8192"  # або llama3-8b-8192 для швидшості
```

### 2. Temperature
```python
temperature=0.7  # 0.0-1.0, вище = більш креативні відповіді
```

### 3. Max Tokens
```python
max_tokens=1500  # Максимальна довжина відповіді
```

## Troubleshooting

### Проблема: "AI feedback not available"
**Рішення:** Перевірте, чи встановлений GROQ_API_KEY у .env файлі

### Проблема: Rate limit exceeded
**Рішення:** Groq має обмеження на кількість запитів. Зачекайте або оновіть план.

### Проблема: Помилка JSON parsing
**Рішення:** AI іноді повертає текст не в JSON форматі. Код має fallback механізм.

## Приклад повного flow

1. Користувач починає інтерв'ю
2. Отримує питання
3. Починає писати відповідь
4. Натискає "Get AI Hint" якщо потрібна допомога
5. Завершує відповідь
6. Переходить до наступного питання
7. Після останнього питання натискає "Submit"
8. Отримує детальний AI фідбек з оцінкою

## Безпека

⚠️ **Важливо:**
- Ніколи не комітьте .env файл з реальними API ключами
- Використовуйте змінні оточення на продакшені
- Обмежте rate limiting для запобігання зловживанням
- Валідуйте всі користувацькі інпути перед відправкою до AI

## Майбутні покращення

- [ ] Кешування підказок для однакових питань
- [ ] Персоналізований фідбек на основі історії користувача
- [ ] Підтримка різних мов
- [ ] Voice-to-text для відповідей
- [ ] Порівняння з іншими кандидатами (анонімно)
