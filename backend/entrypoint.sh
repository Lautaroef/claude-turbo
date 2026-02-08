#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Container starting..."

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn (1 worker to reduce memory usage on Railway)
echo "Starting Gunicorn on port $PORT..."
exec gunicorn config.wsgi:application \
    --bind "0.0.0.0:$PORT" \
    --forwarded-allow-ips "*" \
    --workers 1 \
    --threads 2 \
    --timeout 120 \
    --log-level info \
    --access-logfile - \
    --error-logfile -
