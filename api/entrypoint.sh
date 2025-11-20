#!/bin/bash

set -e

echo "Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL to be ready
while ! pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" > /dev/null 2>&1; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist (optional)
# python manage.py createsuperuser --noinput --email admin@example.com --username admin || true

echo "Starting Django application..."
exec "$@"
