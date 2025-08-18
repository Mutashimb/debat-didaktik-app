// src/pages/DebateDetailPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Spinner from '../components/spinner';
import ArgumentCard from '../components/ArgumentCard';
import TagFallacyModal from '../components/TagFallacyModal';

function DebateDetailPage() {
  const { id } = useParams();
  const [debat, setDebat] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

  const [klaim, setKlaim] = useState('');
  const [bukti, setBukti] = useState('');
  const [jaminan, setJaminan] = useState('');
  
  const [modalState, setModalState] = useState({ isOpen: false, argumentId: null });

  const fetchDebateDetail = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/debat/${id}/`);
      if (!response.ok) throw new Error('Debat tidak ditemukan');
      const data = await response.json();
      setDebat(data);
    } catch (error) {
      console.error("Gagal mengambil detail debat:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDebateDetail();
  }, [fetchDebateDetail]);

  const handleJoinDebate = async () => {
    const toastId = toast.loading("Bergabung ke debat...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/debat/${id}/join/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });
      if (!response.ok) throw new Error('Gagal bergabung ke debat.');
      
      const updatedDebat = await response.json();
      toast.success("Berhasil bergabung!", { id: toastId });
      setDebat(updatedDebat);
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleSubmitArgument = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Mengirim argumen...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/argumen/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          debat: id,
          klaim,
          bukti,
          jaminan,
          ronde: Math.ceil((debat?.argumen_set?.length || 0) / 2) + 1,
        }),
      });
      if (!response.ok) throw new Error('Gagal mengirim argumen.');

      const newArgument = await response.json();
      toast.success("Argumen berhasil dikirim!", { id: toastId });
      setDebat(prevDebat => ({
        ...prevDebat,
        argumen_set: [...prevDebat.argumen_set, newArgument]
      }));
      setKlaim('');
      setBukti('');
      setJaminan('');
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const openTagModal = (argumentId) => setModalState({ isOpen: true, argumentId });
  const closeTagModal = () => setModalState({ isOpen: false, argumentId: null });

  if (loading) return <Spinner />;
  if (!debat) return <p className="text-center text-secondary">Debat tidak ditemukan. <Link to="/" className="text-accent">Kembali</Link></p>;

   // --- LOGIKA BARU UNTUK GILIRAN ---
  const isPro = debat.pengguna_pro === user?.username;
  const isContra = debat.pengguna_kontra === user?.username;
  const isParticipant = isPro || isContra;
  const canJoin = debat.status === 'MENUNGGU' && user && !isPro;

  // Kondisi 1: PRO bisa membuat argumen pembuka saat debat masih menunggu.
  const isProOpeningTurn = isPro && debat.status === 'MENUNGGU' && debat.argumen_set.length === 0;

  // Kondisi 2: Giliran ditentukan oleh jumlah argumen saat debat berlangsung.
  const isDebateActive = debat.status === 'BERLANGSUNG';
  const argCount = debat.argumen_set.length;
  // Giliran PRO jika jumlah argumen genap (0, 2, 4...)
  const isProTurn = isPro && isDebateActive && argCount % 2 === 0;
  // Giliran KONTRA jika jumlah argumen ganjil (1, 3, 5...)
  const isContraTurn = isContra && isDebateActive && argCount % 2 !== 0;

  const canSubmitArgument = isProOpeningTurn || isProTurn || isContraTurn;
  // --- AKHIR DARI LOGIKA BARU ---


  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="bg-gray-900/50 p-6 rounded-lg shadow-lg mb-8">
        <Link to={`/mosi/${debat.mosi_id}`} className="text-accent hover:underline mb-4 block">&larr; Kembali ke Detail Mosi</Link>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{debat.mosi}</h1>
        <div className="flex flex-wrap justify-between items-center text-lg">
          <p className="text-secondary">
            <span className="font-bold text-green-400">PRO:</span> {debat.pengguna_pro} vs <span className="font-bold text-red-400">KONTRA:</span> {debat.pengguna_kontra || '(kosong)'}
          </p>
          <p className="bg-accent text-primary font-bold px-3 py-1 rounded-full text-sm mt-2 md:mt-0">{debat.status}</p>
        </div>
      </div>

      {canJoin && debat.status !== 'SELESAI' && (
        <div className="text-center mb-8">
          <button onClick={handleJoinDebate} className="bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
            🤝 Gabung Debat sebagai KONTRA
          </button>
        </div>
      )}

      {/* Tampilkan pesan jika debat sudah selesai */}
      {debat.status === 'SELESAI' && (
        <div className="text-center mb-8 p-4 bg-green-900/50 border border-green-700 rounded-lg">
          <p className="font-bold text-green-300">Debat ini telah selesai.</p>
          <p className="font-regular text-green-300">Teruslah berlatih dan tingkatkan kemampuan Critical Thinking anda!</p>
        </div>
      )}
      
      <div className="space-y-4">
        {debat.argumen_set.length > 0 ? (
          debat.argumen_set.map(argumen => (
            <ArgumentCard 
              key={argumen.id} 
              argument={argumen} 
              isProSide={argumen.pengguna === debat.pengguna_pro}
              onTagClick={openTagModal}
            />
          ))
        ) : (
          <div className="text-center py-10 text-secondary">
            {debat.status === 'MENUNGGU' ? 'Pihak PRO belum memberikan argumen pembuka...' : 'Belum ada argumen yang dikirim.'}
            </div>
        )}
      </div>

      {canSubmitArgument && (
        <form onSubmit={handleSubmitArgument} className="mt-12 bg-gray-900/50 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-4">Giliran Anda: Kirim Argumen</h3>
          <div className="space-y-4">
            <textarea placeholder="Klaim Anda..." value={klaim} onChange={e => setKlaim(e.target.value)} required rows="3" className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
            <textarea placeholder="Bukti Anda..." value={bukti} onChange={e => setBukti(e.target.value)} required rows="5" className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
            <textarea placeholder="Jaminan Anda..." value={jaminan} onChange={e => setJaminan(e.target.value)} required rows="4" className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"></textarea>
          </div>
          <button type="submit" className="mt-4 w-full bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Kirim Argumen
          </button>
        </form>
      )}

      {/* Tampilkan pesan "Menunggu giliran" jika pengguna adalah partisipan tapi bukan gilirannya */}
      {isParticipant && !canSubmitArgument && debat.status === 'BERLANGSUNG' && (
        <div className="mt-12 text-center p-6 bg-gray-900/50 rounded-lg">
          <p className="text-secondary">Menunggu giliran Anda...</p>
        </div>
      )}

      <TagFallacyModal 
        isOpen={modalState.isOpen}
        onClose={closeTagModal}
        argumentId={modalState.argumentId}
        onTagSuccess={fetchDebateDetail}
      />
    </div>
  );
}

export default DebateDetailPage;


