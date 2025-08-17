# debat/views.py

from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Mosi, Debat, Argumen
from .serializers import (
    MosiSerializer,
    DebatSerializer,
    DebatDetailSerializer,
    ArgumenSerializer,
    UserSerializer,
    CurrentUserSerializer # <-- Pastikan ini ada
)

from .models import Fallacy, TaggedFallacy # <-- Import model baru
from .serializers import FallacySerializer, TaggedFallacySerializer # <-- Import serializer baru




class MosiViewSet(viewsets.ModelViewSet):
    """
    API endpoint yang memungkinkan daftar mosi untuk dilihat oleh siapa saja,
    namun hanya bisa dibuat/diubah/dihapus oleh staf.
    """
    queryset = Mosi.objects.all().order_by('-id')
    serializer_class = MosiSerializer


#metode ini untuk mengatur izin akses
    def get_permissions(self):
        """
        Menentukan izin akses berdasarkan aksi yang diminta.
        """
        # Jika aksinya adalah melihat daftar ('list') atau detail ('retrieve')
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        # Untuk semua aksi lainnya (create, update, destroy)
        else:
            permission_classes = [permissions.IsAdminUser] # IsAdminUser = user.is_staff
        
        return [permission() for permission in permission_classes]



class DebatViewSet(viewsets.ModelViewSet):
    """
    API endpoint untuk melihat dan membuat sesi debat.
    """
    queryset = Debat.objects.all().order_by('-dibuat_pada')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve': # Jika aksinya adalah melihat detail ('retrieve')
            return DebatDetailSerializer
        return DebatSerializer # Untuk semua aksi lainnya (list, create, dll.)

    def perform_create(self, serializer):
        serializer.save(pengguna_pro=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        # ... (fungsi join tidak berubah)
        debat = self.get_object()
        if debat.status != 'MENUNGGU':
            return Response({'error': 'Debat ini tidak sedang menunggu lawan.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if debat.pengguna_pro == request.user:
            return Response({'error': 'Anda tidak bisa menjadi lawan untuk debat yang Anda buat sendiri.'}, status=status.HTTP_400_BAD_REQUEST)

        debat.pengguna_kontra = request.user
        debat.status = 'BERLANGSUNG'
        debat.save()

        return Response(DebatDetailSerializer(debat).data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(pengguna_pro=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def join(self, request, pk=None):
        """Aksi kustom untuk pengguna bergabung sebagai KONTRA."""
        debat = self.get_object()
        if debat.status != 'MENUNGGU':
            return Response({'error': 'Debat ini tidak sedang menunggu lawan.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if debat.pengguna_pro == request.user:
            return Response({'error': 'Anda tidak bisa menjadi lawan untuk debat yang Anda buat sendiri.'}, status=status.HTTP_400_BAD_REQUEST)

        debat.pengguna_kontra = request.user
        debat.status = 'BERLANGSUNG'
        debat.save()

        return Response(DebatDetailSerializer(debat).data, status=status.HTTP_200_OK)

# --- TAMBAHKAN VIEWSET BARU DI BAWAH INI ---
class ArgumenViewSet(viewsets.ModelViewSet):
    """
    API endpoint untuk membuat dan melihat argumen dalam sebuah debat.
    """
    queryset = Argumen.objects.all()
    serializer_class = ArgumenSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Otomatis set 'pengguna' ke user yang sedang login
        serializer.save(pengguna=self.request.user)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny] # Izinkan siapa saja untuk mengakses view ini
    serializer_class = UserSerializer


class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Hanya user yang sudah login yang bisa akses

    def get(self, request, *args, **kwargs):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)
    
    
class FallacyListView(generics.ListAPIView):
    """
    API endpoint untuk melihat daftar semua jenis falasi.
    """
    queryset = Fallacy.objects.all()
    serializer_class = FallacySerializer
    # Izinkan siapa saja untuk melihat daftar falasi
    permission_classes = [permissions.AllowAny] 

class TagFallacyView(generics.CreateAPIView):
    """
    API endpoint untuk menandai sebuah argumen dengan falasi.
    """
    queryset = TaggedFallacy.objects.all()
    serializer_class = TaggedFallacySerializer
    # Hanya user yang sudah login yang bisa menandai
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Otomatis isi field 'tagged_by' dengan user yang sedang login
        serializer.save(tagged_by=self.request.user)