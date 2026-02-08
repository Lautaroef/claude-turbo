FROM python:3.12-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Railway uses dynamic PORT
EXPOSE 8000

# Default command (Railway overrides with startCommand from railway.toml)
CMD ["./entrypoint.sh"]
