from django.db import models
from accounts.models import User 

class Instansi(models.Model):
    nama = models.CharField(max_length=100)

    def __str__(self):
        return self.nama

class Laporan(models.Model):
    STATUS_CHOICES = [
        ('dalam_tinjauan', 'Dalam Tinjauan'),
        ('tidak_terverifikasi', 'Tidak Terverifikasi'),
        ('proses_tindaklanjut', 'Proses Tindaklanjut'),
        ('diberi_tanggapan', 'Diberi Tanggapan'),
        ('selesai', 'Selesai'),
    ]

    pelapor = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'pelapor'})
    instansi = models.ForeignKey(Instansi, on_delete=models.SET_NULL, null=True)
    judul = models.CharField(max_length=255)  # tambahkan judul
    isi = models.TextField()
    foto = models.ImageField(upload_to='laporan_foto/', blank=True, null=True)  # upload foto
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tanggal_dibuat = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.judul} oleh {self.pelapor.username}"
    
class Feedback(models.Model):
    laporan = models.ForeignKey('Laporan', related_name='feedbacks', on_delete=models.CASCADE)
    pengirim = models.ForeignKey(User, on_delete=models.CASCADE)  # bisa petugas atau pelapor
    isi_feedback = models.TextField()
    tanggal_feedback = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback oleh {self.pengirim.username} untuk Laporan {self.laporan.id}"

