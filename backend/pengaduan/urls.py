from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LaporanViewSet, InstansiViewSet, FeedbackViewSet  # Pastikan FeedbackViewSet diimport

router = DefaultRouter()
router.register('laporan', LaporanViewSet)
router.register('instansi', InstansiViewSet)
router.register('feedback', FeedbackViewSet)  # Tambahkan FeedbackViewSet ke router

urlpatterns = [
    path('', include(router.urls)),
]
