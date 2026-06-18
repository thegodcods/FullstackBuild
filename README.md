# QuickHire - AI-Powered CV Screening & Candidate Ranking

---

## 📝 Deskripsi Singkat Proyek

**QuickHire** adalah platform rekrutmen berbasis kecerdasan buatan (AI) yang dirancang untuk mempermudah perekrut (*recruiter*) dalam mencocokkan, menyaring, dan mengurutkan CV/Resume kandidat secara otomatis. 

Berbeda dengan pencarian berbasis kata kunci (*keyword matching*) konvensional yang kaku, QuickHire menggunakan model pemrosesan bahasa alami (NLP) tingkat lanjut (**IndoBERT Reranker**) berbasis *deep learning* untuk mengevaluasi keselarasan semantik antara kualifikasi CV kandidat dengan deskripsi pekerjaan yang dibutuhkan secara mendalam.

---

## 🛠️ Tech Stack yang Digunakan

Proyek ini dibangun menggunakan kombinasi teknologi modern berikut:

### 💻 Frontend
* **React.js (v19)** - Library JavaScript utama untuk membangun antarmuka pengguna yang interaktif.
* **Tailwind CSS (v3)** - Framework CSS utility-first untuk desain antarmuka yang modern dan responsif.
* **Lucide React** - Set ikon yang bersih dan modern untuk kebutuhan antarmuka.

### ⚙️ Backend
* **Python (Flask)** - Micro-framework untuk menyediakan API endpoints dan mengintegrasikan model pembelajaran mesin.
* **MongoDB** - Database NoSQL berorientasi dokumen untuk menyimpan data pengguna, CV, dan hasil screening.
* **PyMongo** - Driver Python resmi untuk menghubungkan Flask dengan database MongoDB.
* **PyJWT & Bcrypt** - Digunakan untuk pengamanan sesi (autentikasi JWT) dan hashing kata sandi pengguna.

### 🧠 AI / Machine Learning & NLP
* **PyTorch (v2.4.1)** - Framework deep learning utama untuk menjalankan arsitektur model reranking.
* **Hugging Face Transformers (v4.44.2)** - Untuk memuat model dasar [indobenchmark/indobert-base-p1](https://huggingface.co/indobenchmark/indobert-base-p1).
* **Sentence Transformers (v3.0.1)** - Digunakan untuk memfasilitasi komputasi kemiripan semantik kalimat.
* **Sastrawi, NLTK, & SpaCy** - Library NLP untuk prapemrosesan teks seperti pembersihan (*preprocessing*), tokenisasi, dan stemming kata bahasa Indonesia.

### 📄 Ekstraksi Dokumen & OCR
* **Pdfplumber** - Mengekstrak teks mentah secara langsung dari berkas PDF kandidat.
* **Tesseract OCR (PyTesseract)** - Mesin OCR untuk mengenali teks pada berkas PDF hasil pemindaian (*scanned/image-only PDF*).
* **Poppler (Pdf2image)** - Mengonversi dokumen PDF menjadi gambar agar dapat dibaca oleh mesin Tesseract OCR.

### 🐳 DevOps & Infrastruktur
* **Docker & Docker Compose** - Memudahkan instalasi dan menjalankan layanan backend, database MongoDB, serta pustaka sistem (Tesseract, Poppler) secara kontainerisasi.

---


## 🧠 Model AI / ML (Artificial Intelligence / Machine Learning)

Aplikasi ini memiliki fitur AI/ML untuk perankingan relevansi kandidat:
- **Base Model (Model Dasar):** [indobenchmark/indobert-base-p1](https://huggingface.co/indobenchmark/indobert-base-p1) (IndoBERT Base model oleh IndoBenchmark).
- **Arsitektur Model Reranker:** Menggunakan kelas `IndoBERTRanker` (didefinisikan di [quickhire_model.py](backend/quickhire_model.py)) yang mengekstrak representasi vektor token `[CLS]` dari output IndoBERT, lalu memasukkannya ke dalam Multi-Layer Perceptron (MLP) regresi untuk menghasilkan skor relevansi kecocokan.
- **Skor Output:** Model memprediksi nilai logits mentah yang kemudian dikalibrasi oleh backend (`scale_score` di `app.py`) menggunakan fungsi Sigmoid untuk dikonversi menjadi persentase kecocokan 0-100% yang dinamis bagi UI.

---

## 🔗 Tautan Model & Cara Memuat (Load)

Untuk menjalankan fitur analisis AI, aplikasi memerlukan file bobot model terlatih (*trained checkpoint*):

> [!IMPORTANT]
> **File Model `best.pt` Diabaikan oleh Git**
> Karena ukuran file model `best.pt` yang sangat besar (~500 MB), file ini telah dimasukkan ke dalam `.gitignore` dan **tidak ikut terunggah** ke repositori GitHub. 
> 
> Agar fitur screening AI dapat berfungsi saat dijalankan secara lokal, Anda **wajib** mengunduh file model `best.pt` terlebih dahulu melalui tautan berikut:
> 👉 **[Download best.pt (Google Drive)](https://drive.google.com/file/d/1uVaXEthrhJNDm0rqZc2qNO1tMuohsxTG)**
> 
> Setelah diunduh, letakkan berkas tersebut langsung di dalam direktori `backend/` (sehingga jalurnya menjadi `backend/best.pt`) sebelum menjalankan server Flask.

- **Cara Memuat Model (Load Model):**
  Model dimuat secara otomatis saat server backend berjalan lewat fungsi `load_model` di [predict_raw_cv.py](backend/predict_raw_cv.py#L6-L29):
  ```python
  # Menginisialisasi arsitektur model kosong
  model = IndoBERTRanker(model_name=MODEL_NAME, hidden_dim=256, dropout=0.1, freeze_bert=False)
  # Memuat checkpoint dari file best.pt
  checkpoint = torch.load("best.pt", map_location=device)
  # Memuat state dict bobot ke dalam arsitektur model
  model.load_state_dict(checkpoint['model_state_dict'])
  model.eval()
  ```

---

## 🚀 Panduan Setup & Menjalankan Aplikasi Secara Lokal

Ikuti langkah-langkah di bawah ini secara berurutan untuk menyiapkan lingkungan kerja dan menjalankan aplikasi di komputer Anda:

### Langkah 1: Siapkan Prasyarat Sistem (Hanya untuk OS Windows Lokal)
Jika dijalankan langsung secara lokal di Windows (bukan Docker), Anda perlu menyiapkan dependensi berikut terlebih dahulu:
- **Instal Tesseract OCR**:
  - Unduh installer dari [Tesseract OCR Windows](https://github.com/UB-Mannheim/tesseract/wiki).
  - Jalankan instalasi.
  - Sesuaikan jalur program executable pada file [backend/ekstraksi_pdf.py](backend/ekstraksi_pdf.py#L14) (default: `C:\Program Files\Tesseract-OCR\tesseract.exe`).
- **Instal Poppler Utils**:
  - Unduh file ZIP dari [Poppler for Windows](https://github.com/oschwartz10612/poppler-windows/releases).
  - Ekstrak file tersebut (misalnya ke `C:\Program Files\poppler-26.02.0`).
  - Sesuaikan jalur folder `bin` pada file [backend/ekstraksi_pdf.py](backend/ekstraksi_pdf.py#L13) (default: `C:\Program Files\poppler-26.02.0\Library\bin`).
- **Instal & Jalankan MongoDB**:
  - Unduh dan instal [MongoDB Community Server](https://www.mongodb.com/try/download/community).
  - Pastikan layanan MongoDB lokal Anda sudah aktif dan berjalan di port default `27017`.

*(Catatan: Langkah prasyarat sistem Windows ini tidak diperlukan jika Anda menggunakan Docker, karena Tesseract, Poppler, dan MongoDB otomatis terinstal dan berjalan di dalam container).*

### Langkah 2: Unduh dan Siapkan Berkas Model `best.pt`
1. Unduh berkas bobot model terlatih `best.pt` (~500 MB) melalui Google Drive:
   👉 **[Download best.pt (Google Drive)](https://drive.google.com/file/d/1uVaXEthrhJNDm0rqZc2qNO1tMuohsxTG)**
2. Letakkan file model tersebut langsung di dalam direktori `backend/` sehingga jalurnya menjadi `backend/best.pt`.

### Langkah 3: Konfigurasi & Jalankan Backend (Flask API)
1. Buka terminal baru dan masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Buat file bernama `.env` di dalam direktori `backend/` dan masukkan konfigurasi berikut:
   ```env
   MONGO_URI=mongodb://localhost:27017/
   SECRET_KEY=thisismysecretkey123
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```
3. Buat Python Virtual Environment:
   ```bash
   python -m venv .venv
   ```
4. Aktifkan Virtual Environment:
   - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
   - **Windows (CMD):** `.venv\Scripts\activate.bat`
   - **macOS/Linux:** `source .venv/bin/activate`
5. Pasang semua dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```
6. Jalankan server Flask API:
   ```bash
   python app.py
   ```
   *Backend API akan aktif dan berjalan di `http://localhost:5000`.*

### Langkah 4: Konfigurasi & Jalankan Frontend (React)
1. Buka terminal baru (biarkan terminal backend di Langkah 3 tetap aktif) dan masuk ke direktori `Frontend`:
   ```bash
   cd Frontend
   ```
2. *(Opsional)* Jika Anda ingin mengubah URL target server backend, buat file `.env` di dalam folder `Frontend/` dan isi:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
3. Pasang semua dependensi npm:
   ```bash
   npm install
   ```
4. Jalankan server development React:
   ```bash
   npm start
   ```
   *Aplikasi web client akan otomatis terbuka di browser Anda pada alamat `http://localhost:3000`.*

---

## 🐳 Opsi Alternatif: Menjalankan Menggunakan Docker (Rekomendasi Cepat)

Jika Anda ingin menjalankan seluruh stack backend (Flask + Tesseract + Poppler) beserta database MongoDB lokal secara instan tanpa perlu instalasi sistem manual:

1. Pastikan **Docker Desktop** sudah terinstal dan aktif di komputer Anda.
2. Pastikan file model `best.pt` sudah diletakkan di dalam folder `backend/` (`backend/best.pt`).
3. Masuk ke folder `backend` lewat terminal:
   ```bash
   cd backend
   ```
4. Jalankan perintah Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
   *Kontainer database MongoDB dan Flask API akan aktif dan berjalan di port `5000`.*
5. Buka terminal baru, masuk ke folder `Frontend`, dan jalankan React:
   ```bash
   cd Frontend
   npm install
   npm start
   ```
