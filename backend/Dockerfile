# Base Python Image
FROM python:3.10-slim

# Working Directory inside container
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --default-timeout=1000 --retries 10 --no-cache-dir -r requirements.txt

# Copy all backend source code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Command to run FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]