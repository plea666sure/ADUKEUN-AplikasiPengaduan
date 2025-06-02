import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1>Selamat Datang di Aplikasi Pengaduan!</h1>
      <h2>Sampaikan Aduan, Bangun Lingkungan Positif</h2>
      <p>Silakan login:</p>
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Link to="/login">
          <button style={{ padding: '10px 20px' }}>Login</button>
        </Link>
        <Link to="/register">
          <button style={{ padding: '10px 20px' }}>Register</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
