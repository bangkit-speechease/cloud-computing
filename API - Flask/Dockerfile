# Gunakan Python sebagai base image
FROM python:3.10-slim

# Set environment variable
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install library sistem yang diperlukan
RUN apt-get update && apt-get install -y libstdc++6 libglib2.0-0 && apt-get clean

# Set working directory di container
WORKDIR /app

# Salin file utama aplikasi
COPY main.py /app/main.py

# Salin folder model
COPY model /app/model

# Salin requirements.txt
COPY requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8080

# Jalankan aplikasi dengan gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers=2", "main:app"]
