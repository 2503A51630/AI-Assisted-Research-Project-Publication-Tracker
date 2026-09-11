# ==========================================
# AI Research Tracker - FastAPI Backend
# ==========================================

FROM python:3.14-slim

# Working directory
WORKDIR /app

# Copy Python dependency file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# FastAPI port
EXPOSE 8001

# Start FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]