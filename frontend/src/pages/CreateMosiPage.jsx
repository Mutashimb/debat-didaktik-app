// src/pages/CreateMosiPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

function CreateMosiPage() {
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [kategori, setKategori] = useState('LAINNYA'); // Default value
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Membuat mosi baru...');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/mosi/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ judul, deskripsi, kategori }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(Object.values(errorData).join('\n') || 'Gagal membuat mosi.');
      }

      const newMosi = await response.json();
      toast.success('Mosi berhasil dibuat!', { id: toastId });
      navigate(`/mosi/${newMosi.id}`); // Arahkan ke halaman detail mosi yang baru dibuat
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/50 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Buat Mosi Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Judul Mosi</label>
          <input
            type="text"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Deskripsi</label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            required
            rows="4"
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="SAINS">Sains & Teknologi</option>
            <option value="SOSPOL">Sosial & Politik</option>
            <option value="EKONOMI">Ekonomi</option>
            <option value="ETIKA">Etika & Filsafat</option>
            <option value="LAINNYA">Lainnya</option>
          </select>
        </div>
        <button
          type="submit"
          
          className="w-full bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Submit Mosi
        </button>
      </form>
    </div>
  );
}

export default CreateMosiPage;