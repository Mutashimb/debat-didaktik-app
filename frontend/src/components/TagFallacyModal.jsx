// src/components/TagFallacyModal.jsx

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function TagFallacyModal({ isOpen, onClose, argumentId, onTagSuccess }) {
  const [fallacies, setFallacies] = useState([]);
  const [selectedFallacy, setSelectedFallacy] = useState('');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const { token } = useAuth();

  // PERBAIKAN LOGIKA DI SINI
  useEffect(() => {
    // Hanya jalankan fetch jika modal terbuka DAN daftar falasi masih kosong
    if (isOpen && fallacies.length === 0) {
      setLoading(true);
      async function fetchFallacies() {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/fallacies/');
          const data = await response.json();
          setFallacies(data);
        } catch (error) {
          console.error("Gagal mengambil daftar falasi:", error);
          toast.error("Gagal memuat daftar falasi.");
        } finally {
          setLoading(false);
        }
      }
      fetchFallacies();
    }
  }, [isOpen, fallacies.length]); // Jalankan efek ini jika isOpen atau panjang fallacies berubah

  const handleSubmit = async () => {
    if (!selectedFallacy) {
      toast.error("Silakan pilih jenis falasi.");
      return;
    }
    
    const toastId = toast.loading("Menandai falasi...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tag-fallacy/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({
          argument: argumentId,
          fallacy: selectedFallacy,
          justification: justification,
        }),
      });
      if (!response.ok) {
        // Coba baca pesan error dari backend
        const errorData = await response.json();
        const errorMessage = Object.values(errorData).join('\n');
        throw new Error(errorMessage || "Gagal menandai falasi.");}
      
      toast.success("Argumen berhasil ditandai!", { id: toastId });
      setJustification('');
      onTagSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-primary p-6 border border-gray-700">
          <Dialog.Title className="text-2xl font-bold text-white mb-4">Tandai Kesesatan Berpikir</Dialog.Title>
          <Dialog.Description className="text-secondary mb-4">
            Pilih jenis kesesatan berpikir (logical fallacy) yang paling sesuai dengan argumen ini.
          </Dialog.Description>
          
          {loading ? (
            <div className="text-center p-4">Memuat falasi...</div>
          ) : (
          <>
            <select 
              value={selectedFallacy} 
              onChange={e => setSelectedFallacy(e.target.value)}
              className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent mb-6"
            >
              <option value="" disabled>Pilih falasi...</option>
              {fallacies.map(fallacy => (
                <option key={fallacy.id} value={fallacy.id}>
                  {fallacy.name}
                </option>
              ))}
            </select>
            <textarea
                placeholder="Berikan penjelasan singkat mengapa Anda memilih falasi ini... (opsional)"
                value={justification}
                onChange={e => setJustification(e.target.value)}
                rows="3"
                className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent mb-6"
              ></textarea>
            </>
          )}

          <div className="flex justify-end gap-4">
            <button onClick={onClose} className="py-2 px-4 rounded-md text-secondary hover:bg-gray-700 transition-colors">Batal</button>
            <button onClick={handleSubmit} disabled={loading} className="bg-accent text-primary font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors disabled:bg-gray-500">Tandai</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
