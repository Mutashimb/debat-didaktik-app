// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../components/spinner';
import { useAuth } from '../context/AuthContext'; 


function HomePage() {
  const {user} = useAuth();
  const [mosiList, setMosiList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Logika pengambilan data tetap sama
    async function fetchMosi() {
      try {
        const response = await fetch('/api/mosi/');
        const data = await response.json();
        setMosiList(data);
      } catch (error) {
        console.error("Gagal mengambil data mosi:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMosi();
  }, []);

  return (
    // Kita hapus tag <> yang lama agar bisa memberi styling pada div utama
    <div className="text-white">

      {/* ===== HERO SECTION ===== */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center  p-8">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4">
          Asah Logika, <span className="bg-gradient-to-r from-accent to-yellow-300 bg-clip-text text-transparent">Raih Argumen Terbaikmu.</span>
        </h1>
        <p className="max-w-3xl text-lg md:text-xl text-secondary mb-8">
          Selamat datang di Debat Didaktik, sebuah platform interaktif yang dirancang khusus untuk melatih dan meningkatkan kemampuan berpikir kritis serta membangun argumen yang kokoh dan terstruktur.
        </p>
        <a 
          href="#mosi-section" 
          className="bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Mulai Jelajahi Topik
        </a>
      </section>

      {/* ===== MOSI SECTION ===== */}
      <section id="mosi-section" className="py-20">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center mb-12">
            Jelajahi <span className="text-accent">Mosi</span> Terhangat
          </h2>
          {user && user.is_staff && (
              <Link to="/mosi/new" className="ml-4 bg-accent text-primary font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-400 transition-colors">
                + Buat Mosi Baru
              </Link>
            )}
          {loading ? (
            <Spinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
              {mosiList.map(mosi => (
                <Link 
                  key={mosi.id} 
                  to={`/mosi/${mosi.id}`} 
                  className="flex flex-col p-8 bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg hover:border-accent transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="flex-grow">
                    <h3 className="mb-2 text-xl font-bold tracking-tight text-white">{mosi.judul}</h3>
                  </div>
                  
                  <p className="font-normal text-secondary line-clamp-5">{mosi.deskripsi}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER SECTION ===== */}
      <footer className='bg-accent text-black'>
        Dibuat Untuk Memenuhi Capstone Project Hactiv8
      </footer>
    </div>
  );
}

export default HomePage;