import React, { useEffect, useState } from 'react';
import api from '../api/api';
import './PetugasDashboard.css';

function PetugasDashboard() {
  const [laporan, setLaporan] = useState([]);
  const [instansi, setInstansi] = useState([]);
  const [formInstansi, setFormInstansi] = useState('');
  const [editId, setEditId] = useState(null);
  const [editNama, setEditNama] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [selectedLaporanId, setSelectedLaporanId] = useState(null);
  const [selectedLaporan, setSelectedLaporan] = useState(null); // ADD this
  const [showModal, setShowModal] = useState(false); // ADD this
  const [activePage, setActivePage] = useState('home');

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const res = await api.get('pengaduan/laporan/');
      setLaporan(res.data);
    } catch (error) {
      alert('Gagal memuat laporan.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstansi = async () => {
    try {
      const res = await api.get('pengaduan/instansi/');
      setInstansi(res.data);
    } catch (error) {
      alert('Gagal memuat instansi.');
      console.error(error);
    }
  };

  const handleTambahInstansi = async (e) => {
    e.preventDefault();
    try {
      await api.post('pengaduan/instansi/', { nama: formInstansi });
      setFormInstansi('');
      fetchInstansi();
    } catch (error) {
      alert('Gagal menambah instansi.');
      console.error(error);
    }
  };

  const handleHapusInstansi = async (id) => {
    if (!window.confirm('Yakin ingin menghapus instansi ini?')) return;
    try {
      await api.delete(`pengaduan/instansi/${id}/`);
      fetchInstansi();
    } catch (error) {
      alert('Gagal menghapus instansi.');
      console.error(error);
    }
  };

  const handleEditInstansi = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`pengaduan/instansi/${editId}/`, { nama: editNama });
      setEditId(null);
      setEditNama('');
      fetchInstansi();
    } catch (error) {
      alert('Gagal mengubah instansi.');
      console.error(error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`pengaduan/laporan/${id}/`, { status });
      fetchLaporan();
    } catch (error) {
      alert('Gagal mengubah status laporan.');
      console.error(error);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLaporanId || !feedback) {
      alert('Pilih laporan dan isi feedback.');
      return;
    }

    try {
      await api.post('pengaduan/feedback/', {
        laporan: selectedLaporanId,
        isi_feedback: feedback,
      });

      await api.patch(`pengaduan/laporan/${selectedLaporanId}/`, { status: 'diberi_tanggapan' });

      setFeedback('');
      setSelectedLaporanId(null);
      setSelectedLaporan(null);
      setShowModal(false);
      alert('Feedback berhasil diberikan!');
      fetchLaporan();
    } catch (error) {
      alert('Gagal memberikan feedback');
      console.error(error);
    }
  };

  const handleDeleteLaporan = (laporanId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      api.delete(`/pengaduan/laporan/${laporanId}/`)
        .then(() => {
          alert('Laporan berhasil dihapus!');
          setLaporan(prev => prev.filter(l => l.id !== laporanId));
          setSelectedLaporanId(null);
          setSelectedLaporan(null);
          setShowModal(false);
        })
        .catch(err => {
          console.error('Gagal menghapus laporan:', err);
          alert('Gagal menghapus laporan.');
        });
    }
  };

  const handleLogOut = () => {
    alert('Log out!');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    fetchLaporan();
    fetchInstansi();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img src='/images/inipp.jpg' alt="Avatar" className="avatar-img" />
        <div className="petugas-name">Nama Petugas</div>

        <button onClick={() => setActivePage('home')}>Home Petugas</button>
        <button onClick={() => setActivePage('laporan')}>Daftar Laporan</button>
        <button onClick={() => setActivePage('instansi')}>Manajemen Instansi</button>
        <button onClick={handleLogOut}>Log Out</button>
      </div>

      {/* Main content */}
      <div className="main-content">
        {activePage === 'home' && (
          <section>
            <h2>Dashboard Petugas</h2>
            <p>Selamat datang, <strong>Nama Petugas</strong>! Ini adalah halaman Home Petugas.</p>

            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Laporan</h3>
                <p>{laporan.length}</p>
              </div>
              <div className="stat-card">
                <h3>Jumlah Instansi</h3>
                <p>{instansi.length}</p>
              </div>
              <div className="stat-card">
                <h3>Laporan Dalam Tinjauan</h3>
                <p>{laporan.filter(l => l.status === 'dalam_tinjauan').length}</p>
              </div>
            </div>

            <div className="recent-activities">
              <h3>Kegiatan Terbaru</h3>
              {laporan.length > 0 ? (
                <ul>
                  {laporan.slice(0, 5).map((l) => (
                    <li key={l.id}>
                      <strong>{l.judul}</strong> - {l.pelapor_username} ({new Date(l.tanggal_dibuat).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Tidak ada laporan terbaru.</p>
              )}
            </div>
          </section>
        )}

        {activePage === 'laporan' && (
          <section>
            <h2>Daftar Laporan</h2>
            {loading ? (
              <p>Memuat laporan...</p>
            ) : (
              <div className="laporan-list">
                {laporan.map((l) => (
                  <div className="laporan-card" key={l.id}>
                    <h3>{l.judul}</h3>
                    <p>{l.isi}</p>
                    <p><small>Dikirim oleh: {l.pelapor_username}</small></p>
                    <div className="laporan-actions">
                      <select value={l.status} onChange={(e) => handleStatusChange(l.id, e.target.value)}>
                        <option value="dalam_tinjauan">Dalam Tinjauan</option>
                        <option value="tidak_terverifikasi">Tidak Terverifikasi</option>
                        <option value="proses_tindaklanjut">Proses Tindaklanjut</option>
                        <option value="diberi_tanggapan">Diberi Tanggapan</option>
                        <option value="selesai">Selesai</option>
                      </select>
                      <button onClick={() => { 
                        setSelectedLaporanId(l.id); 
                        setSelectedLaporan(l); 
                        setShowModal(true); 
                      }}>
                        Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activePage === 'instansi' && (
          <section>
            <h2>Manajemen Instansi</h2>
            <form onSubmit={handleTambahInstansi} className="add-instansi-form">
              <input
                value={formInstansi}
                onChange={(e) => setFormInstansi(e.target.value)}
                placeholder="Nama Instansi"
                required
              />
              <button type="submit">Tambah</button>
            </form>

            <div className="instansi-list">
              {instansi.map((i) => (
                <div className="instansi-card" key={i.id}>
                  <div className="instansi-info">
                    <span>{i.nama}</span>
                  </div>
                  <div className="instansi-actions">
                    {editId === i.id ? (
                      <form onSubmit={handleEditInstansi} style={{ display: 'flex', gap: '5px' }}>
                        <input
                          value={editNama}
                          onChange={(e) => setEditNama(e.target.value)}
                          required
                          style={{ flex: '1' }}
                        />
                        <button type="submit">Simpan</button>
                        <button type="button" onClick={() => setEditId(null)}>Batal</button>
                      </form>
                    ) : (
                      <>
                        <button onClick={() => { setEditId(i.id); setEditNama(i.nama); }}>Edit</button>
                        <button onClick={() => handleHapusInstansi(i.id)}>Hapus</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modal Detail */}
      {showModal && selectedLaporan && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Detail Laporan</h3>
            <p><strong>Judul:</strong> {selectedLaporan.judul}</p>
            <p><strong>Isi:</strong> {selectedLaporan.isi}</p>
            <p><strong>Status:</strong> {selectedLaporan.status}</p>
            <p><strong>Instansi:</strong> {selectedLaporan.instansi_nama}</p>
            <p><strong>Username:</strong> {selectedLaporan.pelapor_username}</p>
            {selectedLaporan.foto && (
              <img src={`http://localhost:8000${selectedLaporan.foto}`} alt="Bukti" />
            )}

            <h4>Feedback Sebelumnya</h4>
            {selectedLaporan.feedbacks.length > 0 ? (
              selectedLaporan.feedbacks.map((f) => (
                <div key={f.id} style={{ borderTop: '1px solid #ccc', marginTop: '10px', paddingTop: '5px' }}>
                  <p><strong>{f.role === 'petugas' ? 'Petugas' : 'Pelapor'} ({f.username})</strong> pada {new Date(f.tanggal_feedback).toLocaleString()}</p>
                  <p>{f.isi_feedback}</p>
                </div>
              ))
            ) : (
              <p>Belum ada feedback.</p>
            )}

            <form onSubmit={handleFeedbackSubmit}>
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                rows={3}
                placeholder="Masukkan feedback"
                required
              />
              <button type="submit">Kirim Feedback</button>
            </form>

            <button onClick={() => handleDeleteLaporan(selectedLaporan.id)} style={{ backgroundColor: 'red', marginTop: '10px' }}>
              Hapus Laporan
            </button>

            <button onClick={() => setShowModal(false)} style={{ marginTop: '10px' }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PetugasDashboard;
