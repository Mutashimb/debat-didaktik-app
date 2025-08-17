// src/components/ChooseSideModal.jsx

import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// PERBAIKAN DI SINI: Pastikan nilai default `[]` untuk existingDebates ada
export default function ChooseSideModal({ isOpen, onClose, mosiId, existingDebates = [] }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Baris ini sekarang aman karena existingDebates dijamin berupa array
  const waitingDebates = existingDebates.filter(debat => debat.status === 'MENUNGGU');

  const handleCreateDebateAsPro = () => {
    const promise = fetch('/api/debat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
      body: JSON.stringify({ mosi_id: mosiId }),
    }).then(response => {
      if (!response.ok) {
        throw new Error('Gagal membuat debat.');
      }
      return response.json();
    });

    toast.promise(
      promise,
      {
        loading: 'Membuat debat baru...',
        success: (newDebate) => {
          navigate(`/debat/${newDebate.id}`);
          return 'Debat baru berhasil dibuat!';
        },
        error: (err) => err.toString(),
      }
    );
  };

  const handleJoinDebateAsContra = (debatId) => {
    const promise = fetch(`http://127.0.0.1:8000/api/debat/${debatId}/join/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` },
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal bergabung ke debat.');
      }
      return response.json();
    });

    toast.promise(
      promise,
      {
        loading: 'Bergabung ke debat...',
        success: () => {
          navigate(`/debat/${debatId}`);
          return 'Berhasil bergabung!';
        },
        error: (err) => err.toString(),
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-primary p-6 border border-gray-700">
          <Dialog.Title className="text-2xl font-bold text-white mb-4">Pilih Sisi Anda</Dialog.Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opsi PRO */}
            <div className="bg-gray-900/50 p-4 rounded-lg flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-green-400 mb-2">Ambil Sisi PRO</h3>
              <p className="text-secondary text-sm mb-4 flex-grow">Mulai sebuah debat baru dan jadilah orang pertama yang memberikan argumen pendukung.</p>
              <button onClick={handleCreateDebateAsPro} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Mulai sebagai PRO
              </button>
            </div>

            {/* Opsi KONTRA */}
            <div className="bg-gray-900/50 p-4 rounded-lg flex flex-col">
              <h3 className="text-xl font-bold text-red-400 mb-2 text-center">Ambil Sisi KONTRA</h3>
              {waitingDebates.length > 0 ? (
                <div className="space-y-2 flex-grow">
                  <p className="text-secondary text-sm mb-2 text-center">Bergabunglah ke debat yang sedang menunggu lawan:</p>
                  {waitingDebates.map(debat => (
                    <button 
                      key={debat.id}
                      onClick={() => handleJoinDebateAsContra(debat.id)}
                      className="w-full bg-red-800 hover:bg-red-900 text-white text-sm py-2 px-3 rounded-md transition-colors text-left"
                    >
                      Lawan <span className="font-bold">{debat.pengguna_pro}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm text-center flex-grow flex items-center justify-center">Saat ini tidak ada debat yang menunggu lawan untuk topik ini.</p>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
