// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import hook autentikasi
import toast from 'react-hot-toast';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { loginAction } = useAuth(); // Ambil fungsi login dari konteks

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Logging in...');

    try {
      const response = await fetch('/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.non_field_errors[0] || 'Gagal login.');
      }

      // Panggil loginAction dengan data yang diterima (berisi token)
      loginAction(data);
      
      toast.success('Login berhasil!', { id: toastId });
      navigate('/'); // Arahkan ke halaman utama setelah berhasil

    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error('Login gagal:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/50 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Login
        </button>
      </form>
      <p className="text-center text-secondary mt-6">
        Belum punya akun?{' '}
        <Link to="/register" className="text-accent hover:underline">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;