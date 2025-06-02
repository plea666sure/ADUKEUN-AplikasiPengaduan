from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('pelapor', 'Pelapor'),
        ('petugas', 'Petugas'),
    )
    email = models.EmailField(unique=True)
    nama_pengadu = models.CharField(max_length=100)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nama_pengadu', 'role']


