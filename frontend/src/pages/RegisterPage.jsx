// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error('Password tidak cocok!');
      return;
    }

    const toastId = toast.loading('Mendaftarkan akun...');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Coba tampilkan error spesifik dari backend jika ada
        const errorMessage = Object.values(data).join('\n');
        throw new Error(errorMessage || 'Gagal mendaftar.');
      }

      toast.success('Registrasi berhasil! Silakan login.', { id: toastId });
      navigate('/login'); // Arahkan ke halaman login setelah berhasil

    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error('Registrasi gagal:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/50 p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Daftar Akun Baru</h1>
      <form onSubmit={handleRegister} className="space-y-6">
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
          <label className="block text-sm font-medium text-secondary mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label className="block text-sm font-medium text-secondary mb-2">Konfirmasi Password</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="w-full p-3 bg-gray-800 text-secondary rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-accent text-primary font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Daftar
        </button>
      </form>
      <p className="text-center text-secondary mt-6">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;