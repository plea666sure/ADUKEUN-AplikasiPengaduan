from rest_framework import viewsets, permissions, status as drf_status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated

from .models import Laporan, Instansi, Feedback
from .serializers import LaporanSerializer, InstansiSerializer, FeedbackSerializer

class IsPetugas(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'petugas'

class InstansiViewSet(viewsets.ModelViewSet):
    queryset = Instansi.objects.all()
    serializer_class = InstansiSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsPetugas()]
        return [permissions.IsAuthenticated()]

class LaporanViewSet(viewsets.ModelViewSet):
    queryset = Laporan.objects.all()
    serializer_class = LaporanSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    STATUS_ORDER = {
        'dalam_tinjauan': 1,
        'tidak_terverifikasi': 2,
        'proses_tindaklanjut': 3,
        'diberi_tanggapan': 4,
        'selesai': 5,
    }

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'pelapor':
            return Laporan.objects.filter(pelapor=user)
        return Laporan.objects.all()

    def perform_create(self, serializer):
        serializer.save(pelapor=self.request.user)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsPetugas()]
        return [permissions.IsAuthenticated()]


    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')

        if new_status and new_status != instance.status:
            old_rank = self.STATUS_ORDER.get(instance.status, 0)
            new_rank = self.STATUS_ORDER.get(new_status, 0)

            if new_rank < old_rank:
                return Response(
                    {"detail": "Tidak boleh mengubah status ke langkah sebelumnya."},
                    status=drf_status.HTTP_400_BAD_REQUEST
                )

        return super().partial_update(request, *args, **kwargs)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        print("DEBUG - USERNAME:", user.username)
        print("DEBUG - ROLE:", getattr(user, 'role', 'N/A'))

        serializer.save(pengirim=user)

        # Update status jika pengirim adalah petugas
        if getattr(user, 'role', '') == 'petugas':
            laporan = serializer.validated_data['laporan']
            if laporan.status not in ['diberi_tanggapan', 'selesai']:
                laporan.status = 'diberi_tanggapan'
                laporan.save(update_fields=["status"])
