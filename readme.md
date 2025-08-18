Debat Didaktik
Sebuah Platform Latihan Argumen Berbasis Web untuk Mengasah Kemampuan Berpikir Kritis.
Debat Didaktik adalah aplikasi web full-stack yang dirancang sebagai "gym untuk otak". Platform ini menyediakan lingkungan yang terstruktur bagi pengguna untuk berlatih membangun argumen yang logis, mengidentifikasi kesesatan berpikir (logical fallacies), dan berpartisipasi dalam debat asinkron berbasis giliran.

Proyek ini dikembangkan sebagai tugas Capstone Project untuk program Student Development Initiative IBM X Hacktiv8.

# Fitur Utama
- Sistem Autentikasi: Pengguna dapat mendaftar, login, dan logout dengan aman menggunakan sistem otentikasi berbasis Token.

- Hak Akses Berbasis Peran: Pengguna dengan status "Staf" memiliki hak istimewa untuk membuat dan mengelola konten mosi (topik debat).

- Bank Mosi: Sebuah koleksi topik debat yang terus berkembang dan dapat dikontribusikan oleh staf, dikategorikan untuk navigasi yang mudah.

- Alur Debat Asinkron: Pengguna dapat memulai debat baru sebagai pihak PRO atau bergabung dengan debat yang ada sebagai pihak KONTRA.

- Sistem Giliran (Turn-based System): Aturan yang jelas memastikan alur debat yang adil, di mana partisipan harus menunggu giliran mereka untuk mengirim argumen.

- Mekanisme Selesai Debat: Debat secara otomatis berakhir setelah mencapai batas ronde, 2 ronde (Berdasarkan format debat British Parliamentary)

- Kerangka Argumen Terstruktur: Setiap argumen harus disampaikan dalam format Klaim, Bukti, dan Jaminan, mendorong pengguna untuk berpikir secara sistematis.

- Fitur Penandaan Falasi (Fallacy Tagging): Fitur edukatif inti di mana pengguna dapat menandai kesesatan berpikir pada argumen lawan dan memberikan justifikasi atas pilihan mereka.

- Halaman Profil Pengguna: Setiap pengguna memiliki halaman profil yang menampilkan riwayat debat mereka, terbagi antara debat yang masih aktif dan yang sudah selesai.

- Desain Modern & Responsif: Dibangun dengan Tailwind CSS, aplikasi ini memiliki antarmuka yang gelap, modern, dan sepenuhnya responsif untuk pengalaman pengguna yang optimal di semua perangkat.

- Tumpukan Teknologi (Tech Stack)
Aplikasi ini dibangun dengan arsitektur client-server yang memisahkan backend dan frontend.


# Teknologi 

- Backend

Django, Django REST Framework, Python

- Frontend

React, Vite, JavaScript, Tailwind CSS, Headless UI, React Hot Toast

- Database

PostgreSQL (Produksi via Neon), SQLite (Pengembangan)

- Deployment

Railway (Backend & Database), Vercel (Frontend)

# Cara Kerja Aplikasi
Backend (Django) bertindak sebagai "otak". Ia mengelola semua data (pengguna, mosi, debat, argumen), menangani logika bisnis (siapa yang boleh berdebat, kapan giliran berakhir), dan menyediakan data secara aman melalui serangkaian API endpoint.

Frontend (React) bertindak sebagai "wajah". Ia bertanggung jawab untuk menampilkan data yang diterima dari backend dengan cara yang menarik dan interaktif. Semua interaksi pengguna (mengklik tombol, mengisi formulir) ditangani di sini.

Komunikasi: Frontend "berbicara" dengan Backend menggunakan permintaan fetch ke API. Misalnya, saat halaman profil dimuat, frontend akan meminta data ke /api/my-debates/, dan backend akan merespons dengan data debat milik pengguna tersebut dalam format JSON.

Menjalankan Proyek Secara Lokal
Untuk menjalankan salinan proyek ini di komputer Anda, ikuti langkah-langkah berikut:

# Prasyarat:

Python 3.10+

Node.js & npm

Git

1. Kloning Repositori
git clone https://github.com/Mutashimb/debat-didaktik-app.git
cd debat-didaktik-app

2. Setup Backend
# Arahkan ke folder api
cd api

# Buat dan aktifkan virtual environment
python -m venv venv
.\venv\Scripts\activate
# source venv/bin/activate # Untuk MacOS/Linux

# Instal dependensi Python
pip install -r requirements.txt

# Buat database lokal
python manage.py makemigrations
python manage.py migrate

# Buat akun superuser
python manage.py createsuperuser

3. Setup Frontend
# Dari folder utama, arahkan ke folder frontend
cd ../frontend

# Instal dependensi JavaScript
npm install

4. Jalankan Aplikasi
Terminal 1 (Backend):

# Di dalam folder api dengan venv aktif
python manage.py runserver

Terminal 2 (Frontend):

# Di dalam folder frontend
npm run dev

Buka http://localhost:5173/ di browser Anda.

Kolaborasi dengan AI
Proyek ini dikembangkan dengan metode pair programming bersama AI. AI digunakan secara ekstensif untuk:

Generasi Kode: Membuat boilerplate untuk model, serializer, view, dan komponen React.

Debugging: Menganalisis pesan error dari terminal dan console untuk menemukan akar masalah dengan cepat.

Refactoring & Best Practices: Memberikan saran untuk menyempurnakan kode, seperti beralih ke otentikasi Token, menggunakan toast.promise, dan mengimplementasikan logika giliran yang lebih baik.

Dokumentasi: Membantu menulis dan merapikan dokumentasi seperti file README ini.

Terima kasih telah mengunjungi repositori ini!

