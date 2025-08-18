// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import Spinner from '../components/spinner'; // Import spinner kita

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  // State loading ini sekarang akan mengontrol seluruh aplikasi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Jika tidak ada token, proses "pemeriksaan" selesai.
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Jika ada token, kita mulai proses loading untuk mengambil data user
    setLoading(true);
    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (!response.ok) throw new Error("Token tidak valid, silakan login kembali.");
        
        const userData = await response.json();
        setUser(userData); // Simpan detail user
      } catch (e) {
        console.error("Gagal mengambil data user:", e);
        // Jika token salah, otomatis logout
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
      } finally {
        // Apapun hasilnya, proses loading selesai
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]); // Efek ini akan berjalan setiap kali token berubah

  const loginAction = (data) => {
    setToken(data.token);
    localStorage.setItem('authToken', data.token);
  };

  const logoutAction = () => {
    // Cukup set token ke null. useEffect di atas akan menangani sisanya.
    setToken(null);
    localStorage.removeItem('authToken');
  };

  const value = { user, token, loading, loginAction, logoutAction };

  return (
    <AuthContext.Provider value={value}>
      {/* Tampilkan spinner jika loading, atau tampilkan aplikasi jika sudah selesai */}
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}