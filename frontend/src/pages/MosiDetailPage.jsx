// src/pages/MosiDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/spinner';
import ChooseSideModal from '../components/ChooseSideModal'; // <-- 1. Import modal baru

function MosiDetailPage() {
  const { id } = useParams();
  const [mosi, setMosi] = useState(null);
  const [debatList, setDebatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  
  // 2. State untuk mengontrol modal baru
  const [isChooseSideModalOpen, setChooseSideModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mosiResponse, debatResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/mosi/${id}/`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/debat/`)
        ]);
        const mosiData = await mosiResponse.json();
        const debatData = await debatResponse.json();
        const filteredDebat = debatData.filter(debat => debat.mosi === mosiData.judul);
        setMosi(mosiData);
        setDebatList(filteredDebat);
      } catch (error) {
        console.error("Gagal mengambil data detail:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // 3. Fungsi untuk membuka modal (atau mengarahkan ke login jika belum login)
  const handleOpenDebateModal = () => {
    if (!user) {
      toast.error("Anda harus login untuk memulai atau bergabung ke debat!");
      return;
    }
    setChooseSideModalOpen(true);
  };

  if (loading) return <Spinner />;
  if (!mosi) return <p>Mosi tidak ditemukan.</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className=" p-6 rounded-lg shadow-lg mb-8">
        <Link to="/" className="text-accent hover:underline mb-4 block">&larr; Kembali ke Daftar Mosi</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{mosi.judul}</h1>
        <p className="text-secondary text-lg text-justify py-5 font-medium leading-relaxed">{mosi.deskripsi}</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Debat Terkait</h2>
        {/* 4. Hubungkan tombol ke fungsi pembuka modal */}
        <button 
          onClick={handleOpenDebateModal} 
          className="bg-accent text-primary font-bold py-2 px-6 rounded-full hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          + Mulai atau Gabung Debat
        </button>
      </div>

      {debatList.length > 0 ? (
        <div className="space-y-4">
          {debatList.map(debat => {
            const statusColor = debat.status === 'MENUNGGU' 
              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400'
              : 'bg-blue-500/20 text-blue-300 border-blue-400';
            return (
              <Link 
                to={`/debat/${debat.id}`} 
                key={debat.id}
                className="block p-6 bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg hover:border-accent transition-all duration-300"
              >
                  <div className="flex flex-col md:flex-row justify-between md:items-center">
                    <div className={`flex-grow-0 px-3 py-1 text-sm font-semibold rounded-full border ${statusColor}`}>
                      ID : {debat.id} 
                    </div>
                    <div className="flex-grow mb-4 md:mb-0">
                      <p className="text-lg text-white">
                        <span className="font-bold text-green-400">PRO:</span> {debat.pengguna_pro}
                      </p>
                      <p className="text-lg text-white">
                        <span className="font-bold text-red-400">KONTRA:</span> {debat.pengguna_kontra || '(menunggu lawan)'}
                      </p>
                    </div>
                    <div className={`flex-grow-0 px-3 py-1 text-sm font-semibold rounded-full border ${statusColor}`}>
                      {debat.status} 
                    </div>
                  </div>
                  
            
                
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-900/50 rounded-lg">
          <p className="text-secondary text-lg">Belum ada debat untuk mosi ini.</p>
          <p className="text-gray-400">Jadilah yang pertama memulai!</p>
        </div>
      )}

      {/* 5. Render modal di sini */}
      <ChooseSideModal 
        isOpen={isChooseSideModalOpen}
        onClose={() => setChooseSideModalOpen(false)}
        mosiId={id}
        existingDebates={debatList}
      />
    </div>
  );
}

export default MosiDetailPage;
