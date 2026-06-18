# Gunakan image dasar Python
FROM python:3.12-slim

# Set variabel lingkungan
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies for OCR and PDF conversion
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-ind \
    poppler-utils \
    libgl1 \
    libglib2.0-0 \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set direktori kerja
WORKDIR /code

# Salin file requirements.txt dan pasang dependensi
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK stopwords
RUN python -c "import nltk; nltk.download('stopwords')"

# Salin seluruh kode sumber backend
COPY . .

# Expose port 5000 untuk local Flask
EXPOSE 5000

# Jalankan aplikasi dengan gunicorn pada port 5000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]