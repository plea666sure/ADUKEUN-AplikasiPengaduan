import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PetugasDashboard from './pages/PetugasDashboard';
import PelaporDashboard from './pages/PelaporDashboard';
import LandingPage from './pages/LandingPage'; // Tambahkan ini

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} /> {/* Landing Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard-petugas" element={<PetugasDashboard />} />
        <Route path="/dashboard-pelapor" element={<PelaporDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
