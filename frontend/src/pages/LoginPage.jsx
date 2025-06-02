import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/accounts/login/', formData);
      localStorage.setItem('token', res.data.access);
      const token = res.data.access;
      const decoded = JSON.parse(atob(token.split('.')[1]));

      if (decoded.role === 'petugas') {
        navigate('/dashboard-petugas');
      } else {
        navigate('/dashboard-pelapor');
      }
    } catch (err) {
      alert('Login gagal. Periksa username/password.');
      console.error(err);
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">Adukeun</div>
        <div className="navbar-links">
          <span onClick={() => navigate('/')} className="navbar-link">Home</span>
          <span onClick={() => navigate('/about')} className="navbar-link">About Us</span>
          <span onClick={goToRegister} className={`navbar-link ${window.location.pathname === '/login' ? 'active' : ''}`}>Sign Up</span>
          <button className="login-button" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </nav>

      <div className="login-page">
        <div className="login-form-container">
          <div className="form-section">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="submit">LOGIN</button>
            </form>
            <p>
              Belum punya akun?{' '}
              <button className="register-button" onClick={goToRegister}>
                Daftar di sini
              </button>
            </p>
          </div>
          <div className="image-section" />
        </div>
      </div>
    </>
  );
}

export default LoginPage;
