FROM python:3.12-slim
# Set working directory
WORKDIR /app
# Install system dependencies including WeasyPrint requirements
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libgdk-pixbuf2.0-0 \
    libffi-dev \
    libcairo2 \
    libgobject-2.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*
# Copy requirements first for better caching
COPY backend/requirements.txt .
# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt
# Copy backend code
COPY backend/ .
# Create necessary directories
RUN mkdir -p logs media/exports
# Expose port
EXPOSE 8000
# Run migrations and start server
CMD python manage.py migrate && python manage.py runserver 0.0.0.0:8000
