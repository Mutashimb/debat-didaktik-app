// src/App.jsx

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MosiDetailPage from './pages/MosiDetailPage';
import DebateDetailPage from './pages/DebateDetailPage';
import Navbar from './components/navbar';
import { Toaster } from 'react-hot-toast';
import RegisterPage from './pages/RegisterPage'; // <-- Import
import LoginPage from './pages/LoginPage';       // <-- Import
import CreateMosiPage from './pages/CreateMosiPage'; // <-- Import
import './App.css';

function App() {
  return (
    <div className="App">
      <Toaster position="top-center" />
      <Navbar />
      <main>
        <Routes>
        {/* Rute untuk Halaman Utama */}
        <Route path="/" element={<HomePage />} />
        
        {/* Rute untuk Halaman Detail Debat */}
        {/* :id adalah parameter dinamis */}
        <Route path="/mosi/:id" element={<MosiDetailPage />} />
        <Route path="/debat/:id" element={<DebateDetailPage />} />
        <Route path="/register" element={<RegisterPage />} /> {/* <-- Tambahkan ini */}
        <Route path="/login" element={<LoginPage />} />       {/* <-- Tambahkan ini */}
        <Route path="mosi/new" element={<CreateMosiPage />} />
      </Routes>
      </main>
    </div>
  );
}

export default App;