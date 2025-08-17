# debat/models.py

from django.db import models
from django.contrib.auth.models import User

# Model untuk Bank Mosi (Topik Debat)
class Mosi(models.Model):
    KATEGORI_CHOICES = [
        ('SAINS', 'Sains & Teknologi'),
        ('SOSPOL', 'Sosial & Politik'),
        ('EKONOMI', 'Ekonomi'),
        ('ETIKA', 'Etika & Filsafat'),
        ('LAINNYA', 'Lainnya'),
    ]

    judul = models.CharField(max_length=200)
    deskripsi = models.TextField()
    kategori = models.CharField(max_length=10, choices=KATEGORI_CHOICES, default='LAINNYA')

    def __str__(self):
        return self.judul

# Model untuk sesi Debat yang sedang berlangsung
class Debat(models.Model):
    STATUS_CHOICES = [
        ('MENUNGGU', 'Menunggu Lawan'),
        ('BERLANGSUNG', 'Sedang Berlangsung'),
        ('SELESAI', 'Selesai'),
    ]

    mosi = models.ForeignKey(Mosi, on_delete=models.CASCADE)
    pengguna_pro = models.ForeignKey(User, related_name='debat_pro', on_delete=models.CASCADE)
    pengguna_kontra = models.ForeignKey(User, related_name='debat_kontra', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='MENUNGGU')
    dibuat_pada = models.DateTimeField(auto_now_add=True)

    # 2 ronde berarti 4 argumen total (2 dari PRO, 2 dari KONTRA)
    max_rounds = models.PositiveIntegerField(default=2) 

    def __str__(self):
        return f"Debat tentang: {self.mosi.judul}"
    

# Model untuk setiap Argumen yang dikirim
class Argumen(models.Model):
    debat = models.ForeignKey(Debat, on_delete=models.CASCADE)
    pengguna = models.ForeignKey(User, on_delete=models.CASCADE)
    klaim = models.TextField()
    bukti = models.TextField()
    jaminan = models.TextField()
    ronde = models.IntegerField(default=1)
    dikirim_pada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Argumen oleh {self.pengguna.username} di Ronde {self.ronde}"
    
class Fallacy(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name

class TaggedFallacy(models.Model):
    argument = models.ForeignKey(Argumen, on_delete=models.CASCADE)
    fallacy = models.ForeignKey(Fallacy, on_delete=models.CASCADE)
    tagged_by = models.ForeignKey(User, on_delete=models.CASCADE)
    tagged_at = models.DateTimeField(auto_now_add=True)
    justification = models.TextField(blank=True, null=True)
    
    class Meta:
        # Pastikan satu user tidak bisa menandai argumen yang sama dengan falasi yang sama lebih dari sekali
        unique_together = ('argument', 'fallacy', 'tagged_by')

    def __str__(self):
        return f'Tagged as "{self.fallacy.name}" by {self.tagged_by.username}'