# QuickHire - AI-Powered CV Screening & Candidate Ranking

---

## 📝 Deskripsi Singkat Proyek

**QuickHire** adalah platform rekrutmen berbasis kecerdasan buatan (AI) yang dirancang untuk mempermudah perekrut (*recruiter*) dalam mencocokkan, menyaring, dan mengurutkan CV/Resume kandidat secara otomatis. 

Berbeda dengan pencarian berbasis kata kunci (*keyword matching*) konvensional yang kaku, QuickHire menggunakan model pemrosesan bahasa alami (NLP) tingkat lanjut (**IndoBERT Reranker**) berbasis *deep learning* untuk mengevaluasi keselarasan semantik antara kualifikasi CV kandidat dengan deskripsi pekerjaan yang dibutuhkan secara mendalam.

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

## ⚙️ Petunjuk Setup Environment

Ikuti langkah-langkah di bawah ini untuk menyiapkan lingkungan kerja sebelum menjalankan aplikasi secara lokal:

### 1. Prasyarat Sistem (Hanya untuk OS Windows Lokal)
Jika dijalankan langsung secara lokal di OS Windows, pastikan Anda telah menyiapkan dependensi eksternal berikut:
- **Instal Tesseract OCR:** 
  Download installer Tesseract OCR untuk Windows, jalankan instalasi, dan sesuaikan path program executable di komputer Anda pada file `backend/ekstraksi_pdf.py` baris 14:
  ```python
  pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
  ```
- **Instal Poppler Utils:** 
  Download file zip Poppler untuk Windows, ekstrak, dan sesuaikan path folder bin di komputer Anda pada file `backend/ekstraksi_pdf.py` baris 13:
  ```python
  POPPLER_PATH = r'C:\Program Files\poppler-26.02.0\Library\bin'
  ```
- **Instal MongoDB:** 
  Instal MongoDB Community Server lokal dan pastikan layanannya berjalan di port default `27017`.

*(Catatan: Langkah prasyarat sistem Windows ini tidak diperlukan jika Anda menggunakan Docker, karena Tesseract, Poppler, dan MongoDB otomatis terinstal dan terkonfigurasi secara otomatis di dalam container).*

### 2. Setup Database & Akun MongoDB
Pastikan layanan MongoDB berjalan secara lokal di port `27017`. Aplikasi backend akan otomatis membuat database bernama `quick_hire` saat dijalankan pertama kali.

### 3. Setup Python Virtual Environment (Backend)
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Buat Virtual Environment:
   ```bash
   python -m venv .venv
   ```
3. Aktifkan Virtual Environment:
   - **Windows (PowerShell):** `.venv\Scripts\Activate.ps1`
   - **Windows (CMD):** `.venv\Scripts\activate.bat`
   - **macOS/Linux:** `source .venv/bin/activate`
4. Pasang semua dependensi Python:
   ```bash
   pip install -r requirements.txt
   ```

### 4. Setup Node.js (Frontend)
1. Masuk ke direktori Frontend:
   ```bash
   cd ../Frontend
   ```
2. Pasang semua dependensi npm:
   ```bash
   npm install
   ```

### 5. Setup Konfigurasi API (Frontend - Opsional)
Secara default, Frontend React akan terhubung ke API backend lokal di `http://127.0.0.1:5000`. Jika Anda ingin mengubah URL server backend (misal ketika dideploy), buat file `.env` di dalam folder `Frontend/` dan isi:
```env
REACT_APP_API_URL=http://localhost:5000
```


---

## 🏃 Cara Menjalankan Aplikasi

Aplikasi dapat dijalankan secara lokal (manual) atau menggunakan container Docker.

### Opsi A: Menjalankan Secara Lokal (Manual)

#### 1. Jalankan Backend
1. Masuk ke folder `backend` dan pastikan virtual environment aktif.
2. Buat file `.env` di dalam folder `backend/` dengan isi berikut:
   ```env
   MONGO_URI=mongodb://localhost:27017/
   SECRET_KEY=thisismysecretkey123
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```
3. Jalankan server Flask API:
   ```bash
   python app.py
   ```
   *Backend API akan aktif dan berjalan di `http://localhost:5000`*

#### 2. Jalankan Frontend
1. Buka terminal baru dan masuk ke folder `Frontend`.
2. Jalankan server development React:
   ```bash
   npm start
   ```
   *Aplikasi web client akan otomatis terbuka di browser Anda pada alamat `http://localhost:3000`*

---

### Opsi B: Menjalankan Menggunakan Docker (Rekomendasi Deployment)

Untuk menjalankan seluruh stack backend (Flask + Tesseract + Poppler) beserta database MongoDB lokal secara instan tanpa perlu setup manual, gunakan Docker Compose:

1. Pastikan Docker Desktop sudah terinstal dan aktif.
2. Masuk ke folder `backend/`.
3. Jalankan perintah:
   ```bash
   docker-compose up -d --build
   ```
4. Kontainer database MongoDB dan Flask API akan aktif dan berjalan di port `5000`. Anda tinggal menjalankan Frontend React secara lokal atau men-deploy-nya ke hosting statis.
