# debat/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MosiViewSet
from .views import MosiViewSet, DebatViewSet
from .views import MosiViewSet, DebatViewSet, ArgumenViewSet, RegisterView # Tambahkan ArgumenViewSet
from rest_framework.authtoken.views import obtain_auth_token
from .views import  UserDetailView # <-- Import view baru
from .views import FallacyListView, TagFallacyView # <-- Import view baru




# Buat router dan daftarkan ViewSet kita.
router = DefaultRouter()
router.register(r'mosi', MosiViewSet)
router.register(r'debat', DebatViewSet)
router.register(r'argumen', ArgumenViewSet) # <-- TAMBAHKAN BARIS INI



# URL API sekarang ditentukan secara otomatis oleh router.
urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),  # Tambahkan URL untuk registrasi
    path('login/', obtain_auth_token, name='login'), # URL untuk login menggunakan token
    path('user/', UserDetailView.as_view(), name='user-detail'), # URL untuk mendapatkan detail user yang sedang login
    path('fallacies/', FallacyListView.as_view(), name='fallacy-list'), # URL untuk daftar fallacy
    path('tag-fallacy/', TagFallacyView.as_view(), name='tag-fallacy'), # URL untuk menandai fallacy
    path('create-mosi/', MosiViewSet.as_view({'post': 'create'}), name='create-mosi'), # URL untuk membuat mosi baru
]