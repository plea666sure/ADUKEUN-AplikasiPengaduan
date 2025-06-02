import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    nama_pengadu: '',
    role: 'pelapor',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/accounts/register/', formData);
      alert('Registrasi berhasil!');
      navigate('/login'); // Redirect to login after successful registration
    } catch (err) {
      alert('Registrasi gagal');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">Adukeun</div>
        <div className="navbar-links">
          <span onClick={() => navigate('/')} className="navbar-link">Home</span>
          <span onClick={() => navigate('/about')} className="navbar-link">About Us</span>
          <span onClick={() => navigate('/login')} className={`navbar-link ${window.location.pathname === '/register' ? 'active' : ''}`}>Sign In</span>
          <button className="login-button" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </nav>

      <div className="register-page">
        <div className="register-form-container">
          <div className="form-section">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <label>Nama Lengkap</label>
              <input
                name="nama_pengadu"
                placeholder="Masukkan nama lengkap"
                onChange={handleChange}
                required
              />
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Masukkan email"
                onChange={handleChange}
                required
              />
              <label>Username</label>
              <input
                name="username"
                placeholder="Masukkan username"
                onChange={handleChange}
                required
              />
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Masukkan password"
                onChange={handleChange}
                required
              />
              <label>Role</label>
              <select name="role" onChange={handleChange}>
                <option value="pelapor">Pelapor</option>
              </select>
              <button type="submit">DAFTAR</button>
            </form>
          </div>
          <div className="image-section" />
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
