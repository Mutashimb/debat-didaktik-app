// src/pages/ProfilePage.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Spinner from '../components/spinner';

function ProfilePage() {
  const { user, token } = useAuth();
  const [activeDebates, setActiveDebates] = useState([]);
  const [completedDebates, setCompletedDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      async function fetchMyDebates() {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/my-debates/`, {
            headers: { 'Authorization': `Token ${token}` }
          });
          if (!response.ok) throw new Error("Gagal memuat riwayat debat.");
          
          const data = await response.json();
          setActiveDebates(data.filter(d => d.status === 'BERLANGSUNG' || d.status === 'MENUNGGU'));
          setCompletedDebates(data.filter(d => d.status === 'SELESAI'));
        } catch (error) {
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
      fetchMyDebates();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) return <Spinner />;
  if (!user) return <p className="text-center text-secondary">Silakan login untuk melihat profil Anda.</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* Kartu Profil Pengguna */}
      <div className="bg-gray-900/50 p-6 rounded-lg shadow-lg mb-8 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center font-bold text-primary text-4xl">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{user.username}</h1>
          <p className="text-secondary">{user.email}</p>
        </div>
      </div>

      {/* Debat Aktif */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Debat Aktif</h2>
        {activeDebates.length > 0 ? (
          <div className="space-y-4 text-left">
            {activeDebates.map(debat => <DebateListItem key={debat.id} debat={debat} currentUser={user} />)}
          </div>
        ) : (
          <p className="text-secondary">Anda tidak memiliki debat yang sedang aktif.</p>
        )}
      </div>

      {/* Riwayat Debat */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Riwayat Debat</h2>
        {completedDebates.length > 0 ? (
          <div className="space-y-4">
            {completedDebates.map(debat => <DebateListItem key={debat.id} debat={debat} currentUser={user} />)}
          </div>
        ) : (
          <p className="text-secondary">Anda belum menyelesaikan debat apa pun.</p>
        )}
      </div>
    </div>
  );
}

// Komponen kecil untuk menampilkan satu item debat
function DebateListItem({ debat, currentUser }) {
  const statusColor = {
    'MENUNGGU': 'bg-yellow-500/20 text-yellow-300 border-yellow-400',
    'BERLANGSUNG': 'bg-blue-500/20 text-blue-300 border-blue-400',
    'SELESAI': 'bg-gray-500/20 text-gray-400 border-gray-600',
  }[debat.status];

  // Logika baru yang lebih baik untuk menentukan lawan
  const opponent = currentUser.username === debat.pengguna_pro 
    ? debat.pengguna_kontra 
    : debat.pengguna_pro;
    

  return (
    <Link 
      to={`/debat/${debat.id}`} 
      className="block p-4 bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg hover:border-accent transition-all duration-300"
    >
      {/* PERUBAHAN DI SINI: Dihapus 'justify-between' dan ditambahkan 'gap-4' */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Konten utama sekarang berada di dalam div yang akan tumbuh */}
        <div className={`flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColor} self-start md:self-center`}>
                {debat.id}
            </div>
        
            <div className="flex-grow">
                <p className="text-lg text-white font-semibold">{debat.mosi}</p>
                <p className="text-sm text-secondary">
                    vs {<span className='text-blue-500 font-semibold'> 
                        {opponent || <span className='text-red-500 font-semibold'> {'(menunggu lawan)'} 
                        </span>} 
                        </span>}
                </p>
            </div>
        
        
        {/* Badge status sekarang akan berada di paling kanan */}
     
            <div className={`flex px-3 py-1 text-xs font-semibold rounded-full border ${statusColor} self-start md:self-center`}>
                {debat.status}
            </div>
        
      </div>
    </Link>
  );
}

export default ProfilePage;
