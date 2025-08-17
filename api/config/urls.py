# config/urls.py

from django.contrib import admin
from django.urls import path, include  # Pastikan 'include' ada di sini

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('debat.urls')), # <-- TAMBAHKAN BARIS INI
]