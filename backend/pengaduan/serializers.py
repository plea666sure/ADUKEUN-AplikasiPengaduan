from rest_framework import serializers
from .models import Instansi, Laporan, Feedback

class InstansiSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instansi
        fields = ['id', 'nama']

class FeedbackSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Feedback
        fields = ['id', 'laporan', 'isi_feedback', 'tanggal_feedback', 'role', 'username']

    def get_role(self, obj):
        return getattr(obj.pengirim, 'role', '')

    def get_username(self, obj):
        return obj.pengirim.username

        
class LaporanSerializer(serializers.ModelSerializer):
    pelapor_username = serializers.CharField(source='pelapor.username', read_only=True)
    instansi_nama = serializers.CharField(source='instansi.nama', read_only=True)
    feedbacks = FeedbackSerializer(many=True, read_only=True)  # Include feedbacks

    class Meta:
        model = Laporan
        fields = ['id', 'pelapor', 'pelapor_username', 'instansi', 'instansi_nama',
                  'judul', 'isi', 'foto', 'status', 'tanggal_dibuat', 'feedbacks']
        read_only_fields = ['pelapor']


