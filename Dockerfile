# Use official Python 3.11 slim (Debian Bookworm) – good choice for size
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install system dependencies needed for pycairo + reportlab + general builds
# ────────────────────────────────────────────────────────────────
# Added: libcairo2-dev pkg-config  → fixes the cairo / pkg-config error
# Also added python3-dev (often needed for C extensions)
# libpq-dev kept if you use PostgreSQL, otherwise you can remove it
# ────────────────────────────────────────────────────────────────
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
        libcairo2-dev \
        pkg-config \
        python3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Collect static files (if your project uses them)
RUN python manage.py collectstatic --noinput

# Expose port – you were using 8000 here, but earlier logs showed Gunicorn on 10000
# Pick one consistently (Render usually expects what you set in CMD)
EXPOSE 8000

# Run with gunicorn – adjust workers/timeout as needed
# If Render expects port 10000, change to --bind 0.0.0.0:10000
CMD ["gunicorn", "project_manager_ai.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]
