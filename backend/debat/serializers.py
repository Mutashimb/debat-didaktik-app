# debat/serializers.py

from rest_framework import serializers
from .models import Mosi, Debat, Argumen, Fallacy, TaggedFallacy # Tambahkan Debat di import
from django.contrib.auth.models import User

class MosiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mosi
        fields = ['id', 'judul', 'deskripsi', 'kategori']


class DebatSerializer(serializers.ModelSerializer):
    # Field ini hanya untuk dibaca, menampilkan nama/judul, bukan ID
    mosi = serializers.StringRelatedField(source='mosi.judul', read_only=True)
    pengguna_pro = serializers.StringRelatedField(read_only=True)
    pengguna_kontra = serializers.StringRelatedField(read_only=True)
    
    # Field ini hanya untuk ditulis, menerima ID dari mosi
    mosi_id = serializers.PrimaryKeyRelatedField(
        queryset=Mosi.objects.all(), source='mosi', write_only=True
    )

    class Meta:
        model = Debat
        fields = ['id', 'mosi', 'mosi_id', 'pengguna_pro', 'pengguna_kontra', 'status']

class TaggedFallacyDetailSerializer(serializers.ModelSerializer):
    fallacy_name = serializers.CharField(source='fallacy.name')
    fallacy_description = serializers.CharField(source='fallacy.description')
    tagged_by = serializers.CharField(source='tagged_by.username')
    justification = serializers.CharField()

    class Meta:
        model = TaggedFallacy
        fields = ['fallacy_name', 'fallacy_description', 'tagged_by', 'justification']


class ArgumenSerializer(serializers.ModelSerializer):
    """Serializer untuk menampilkan dan membuat argumen."""
    pengguna = serializers.StringRelatedField(read_only=True)
    # Gunakan serializer baru yang lebih detail
    taggedfallacy_set = TaggedFallacyDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Argumen
        fields = ['id', 'debat', 'pengguna', 'klaim', 'bukti', 'jaminan', 'ronde', 'dikirim_pada', 'taggedfallacy_set']
        read_only_fields = ['pengguna']



class DebatDetailSerializer(serializers.ModelSerializer):
    """Serializer untuk menampilkan detail satu debat, termasuk argumennya."""
    mosi = serializers.StringRelatedField()
    mosi_id = serializers.ReadOnlyField(source='mosi.id')
    pengguna_pro = serializers.StringRelatedField()
    pengguna_kontra = serializers.StringRelatedField()
    # 'argumen_set' adalah cara Django mengambil semua argumen terkait
    argumen_set = ArgumenSerializer(many=True, read_only=True)

    class Meta:
        model = Debat
        fields = ['id', 'mosi', 'mosi_id', 'pengguna_pro', 'pengguna_kontra', 'status', 'argumen_set']

# Mekanisme Registrasi dan Login
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Gunakan create_user untuk memastikan password di-hash dengan benar
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff']

class FallacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fallacy
        fields = ['id', 'name', 'description']

class TaggedFallacySerializer(serializers.ModelSerializer):
    class Meta:
        model = TaggedFallacy
        # Saat menandai, user hanya perlu mengirim ID argumen dan ID falasi
        fields = ['id', 'argument', 'fallacy', 'justification']

