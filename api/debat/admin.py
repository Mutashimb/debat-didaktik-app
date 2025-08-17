# debat/admin.py

from django.contrib import admin
from .models import Mosi, Debat, Argumen, Fallacy, TaggedFallacy

# Daftarkan model Anda di sini agar muncul di halaman admin.
admin.site.register(Mosi)
admin.site.register(Debat)
admin.site.register(Argumen)
admin.site.register(Fallacy)
admin.site.register(TaggedFallacy)