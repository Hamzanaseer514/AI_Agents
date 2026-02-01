# syntax=docker/dockerfile:1
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps:
# - build-essential, python3-dev → for compiling extensions (pycairo etc.)
# - libcairo2-dev pkg-config → for pycairo/reportlab
# - unixodbc unixodbc-dev libodbc2 → provides libodbc.so.2 etc.
# - curl gnupg ca-certificates → for adding Microsoft repo
# - Then install msodbcsql17 (or msodbcsql18)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libcairo2-dev \
    pkg-config \
    libpq-dev \
    curl \
    gnupg \
    ca-certificates \
    unixodbc \
    unixodbc-dev \
    && curl https://packages.microsoft.com/keys/microsoft.asc | tee /etc/apt/trusted.gpg.d/microsoft.asc \
    && curl https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql17 \
    # Optional: msodbcsql18 instead (update 'driver' in settings.py to 'ODBC Driver 18 for SQL Server')
    # && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    # Quick check (optional, for debugging)
    && odbcinst -q -d || true

# Copy & install Python deps
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static (this should now work since pyodbc can import)
RUN python manage.py collectstatic --noinput

# Expose port (use 10000 if that's what your earlier Gunicorn logs showed; or keep 8000)
EXPOSE 10000

# CMD – bind to $PORT if Render sets it, or hardcode. Add --workers etc.
CMD ["gunicorn", "project_manager_ai.wsgi:application", "--bind", "0.0.0.0:10000", "--workers", "2", "--timeout", "120"]
