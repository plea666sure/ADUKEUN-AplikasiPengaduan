import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './PelaporDashboard.css';

function PelaporDashboard({ currentUser  }) {
  const [instansi, setInstansi] = useState([]);
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [instansiId, setInstansiId] = useState('');
  const [foto, setFoto] = useState(null);
  const [laporanSaya, setLaporanSaya] = useState([]);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [balasan, setBalasan] = useState('');
  const [activePage, setActivePage] = useState('home'); // State for active page

  const fetchInstansi = async () => {
    try {
      const res = await api.get('pengaduan/instansi/');
      setInstansi(res.data);
    } catch (err) {
      alert('Gagal memuat instansi');
    }
  };

  const fetchLaporanSaya = async () => {
    try {
      const res = await api.get('pengaduan/laporan/');
      setLaporanSaya(res.data);
    } catch (err) {
      alert('Gagal memuat laporan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !isi || !instansiId) return alert('Semua field wajib diisi.');

    try {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('isi', isi);
      formData.append('instansi', instansiId);
      if (foto) formData.append('foto', foto);

      await api.post('pengaduan/laporan/', formData);
      setJudul(''); setIsi(''); setInstansiId(''); setFoto(null);
      fetchLaporanSaya();
    } catch (err) {
      alert('Gagal mengirim laporan');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('pengaduan/feedback/', {
        laporan: selectedLaporan.id,
        isi_feedback: balasan,
      });
      setBalasan('');
      setSelectedLaporan(null);
      fetchLaporanSaya();
    } catch (err) {
      alert('Gagal mengirim feedback');
    }
  };

  const handleLogOut = () => {
      alert('Log out!');
      localStorage.removeItem('token'); 
      window.location.href = '/';
  };

  useEffect(() => {
    fetchInstansi();
    fetchLaporanSaya();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src='/images/inipp.jpg' alt="Avatar" className="avatar-img" />
        <div className="pelapor-name">{currentUser?.username || 'Anonim'}</div>

        <button onClick={() => setActivePage('home')}>
          <i className="fa fa-home"></i> Home Pelapor
        </button>
        <button onClick={() => setActivePage('kirim')}>
          <i className="fa fa-paper-plane"></i> Kirim Laporan
        </button>
        <button onClick={() => setActivePage('riwayat')}>
          <i className="fa fa-history"></i> Riwayat Laporan
        </button>
        <button onClick={handleLogOut}>
          <i className="fa fa-sign-out"></i> Log Out
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activePage === 'home' && (
          <section>
            <h2>Dashboard Pelapor</h2>
            <p>Selamat datang, <strong>{currentUser?.username || 'Anonim'}</strong>! Ini adalah halaman Home Pelapor.</p>

            {/* Statistik Pengaduan */}
            <div className="stats-container">
              <div className="stat-item">
                <h3>{laporanSaya.length}</h3>
                <p>Pengaduan Diajukan</p>
              </div>
              <div className="stat-item">
                <h3>{laporanSaya.filter(l => l.status === 'proses').length}</h3>
                <p>Pengaduan Sedang Diproses</p>
              </div>
              <div className="stat-item">
                <h3>{laporanSaya.filter(l => l.status === 'selesai').length}</h3>
                <p>Pengaduan Selesai</p>
              </div>
            </div>

            {/* Pengumuman atau Berita Terbaru */}
            <div className="announcement">
              <h3>Pengumuman Terbaru</h3>
              <p>Pastikan untuk selalu memeriksa pengumuman terbaru terkait layanan kami.</p>
            </div>

            {/* Tips dan Panduan */}
            <div className="tips">
              <h3>Tips Mengajukan Pengaduan</h3>
              <ul>
                <li>Jelaskan masalah Anda dengan jelas dan singkat.</li>
                <li>Berikan informasi yang relevan dan lengkap.</li>
                <li>Unggah bukti jika diperlukan.</li>
              </ul>
            </div>

            {/* Testimoni */}
            <div className="testimonials">
              <h3>Testimoni Pengguna</h3>
              <p>"Layanan pengaduan ini sangat membantu dan responsif!" - Pengguna A</p>
              <p>"Saya puas dengan penanganan pengaduan saya." - Pengguna B</p>
            </div>
          </section>
        )}


        {activePage === 'kirim' && (
          <section className="kirim-pengaduan">
            <h3>Kirim Pengaduan</h3>
            <form onSubmit={handleSubmit} className="form-kirim">
              <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} placeholder="Judul laporan" required />
              <textarea value={isi} onChange={(e) => setIsi(e.target.value)} placeholder="Tuliskan pengaduan anda" required rows={4} />
              <select value={instansiId} onChange={(e) => setInstansiId(e.target.value)} required>
                <option value="">Pilih instansi tujuan</option>
                {instansi.map((i) => <option key={i.id} value={i.id}>{i.nama}</option>)}
              </select>
              <input type="file" onChange={(e) => setFoto(e.target.files[0])} accept="image/*" />
              <button type="submit">Kirim</button>
            </form>
          </section>
        )}

        {activePage === 'riwayat' && (
          <section className="riwayat-laporan">
            <h3>Riwayat Laporan</h3>
            <div className="laporan-list">
              {laporanSaya.map((l) => (
                <div className="laporan-card" key={l.id}>
                  <h4>{l.judul}</h4>
                  <p>Status: {l.status}</p>
                  <p>Instansi: {l.instansi_nama}</p>
                  <button onClick={() => { setSelectedLaporan(l); setBalasan(''); }}>Lihat Detail</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {selectedLaporan && (
          <div className="modal-overlay" onClick={() => setSelectedLaporan(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Detail Laporan</h3>
              <p><strong>Judul:</strong> {selectedLaporan.judul}</p>
              <p><strong>Isi:</strong> {selectedLaporan.isi}</p>
              <p><strong>Status:</strong> {selectedLaporan.status}</p>
              <p><strong>Instansi:</strong> {selectedLaporan.instansi_nama}</p>
              {selectedLaporan.foto && (
                <img src={`http://localhost:8000${selectedLaporan.foto}`} alt="Bukti" />
              )}

              <h4>Feedback</h4>
              {selectedLaporan.feedbacks.map((fb) => (
                <div key={fb.id} className="feedback-box">
                  <p><strong>{fb.role === 'pelapor' ? 'Anda' : 'Petugas'}:</strong> {fb.isi_feedback}</p>
                  <p><em>{new Date(fb.tanggal_feedback).toLocaleString()}</em></p>
                </div>
              ))}

              {!selectedLaporan.feedbacks.some(f => f.role === 'pelapor') &&
                selectedLaporan.feedbacks.some(f => f.role === 'petugas') && (
                  <form onSubmit={handleFeedbackSubmit}>
                    <textarea
                      value={balasan}
                      onChange={(e) => setBalasan(e.target.value)}
                      placeholder="Berikan tanggapan Anda"
                      rows={3}
                      required
                    />
                    <button type="submit">Kirim Balasan</button>
                  </form>
                )}

              <button onClick={() => setSelectedLaporan(null)} className="tutup-btn">Tutup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PelaporDashboard;
