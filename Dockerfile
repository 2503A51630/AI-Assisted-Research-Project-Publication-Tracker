# ==========================================
# AI Research Tracker - FastAPI Backend
# ==========================================

FROM python:3.14-slim

# Working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Document the default local port
EXPOSE 8001

# Start FastAPI
# Use Render's PORT when deployed.
# Use 8001 when running locally.
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8001}"]