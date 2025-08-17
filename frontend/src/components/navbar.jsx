// src/components/Navbar.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal'; // <-- 1. Import modal

function Navbar() {
  const { user, token, logoutAction } = useAuth();
  const navigate = useNavigate();
  
  // 2. State untuk mengontrol visibilitas modal
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleConfirmLogout = () => {
    logoutAction(); // Panggil fungsi logout dari konteks
    setLogoutModalOpen(false); // Tutup modal
    navigate('/'); // Arahkan ke halaman utama
  };

  return (
    <>
      <nav className="bg-primary border-b border-gray-700 shadow-lg">
        <div className="container mx-auto px-8 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white hover:text-accent transition-colors">
            Debat Didaktik
          </Link>

          <div className="space-x-6 flex items-center">
            {token && user ? (
              <>
                <Link to="/profile" className="text-secondary hover:text-white transition-colors">
                  {user.username}
                </Link>
                {/* 3. Tombol logout sekarang membuka modal */}
                <button 
                  onClick={() => setLogoutModalOpen(true)} 
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full text-sm transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-secondary hover:text-white transition-colors">
                  Register
                </Link>
                <Link to="/login" className="bg-accent text-primary font-bold py-2 px-4 rounded-full text-sm hover:bg-yellow-400 transition-colors">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 4. Render modal di sini */}
      <LogoutConfirmationModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

export default Navbar;
