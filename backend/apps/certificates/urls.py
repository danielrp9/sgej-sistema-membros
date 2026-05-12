from django.urls import path
from .views import (
    CertificateListCreateView,
    CertificateDetailView,
    CertificateApprovalView,
    CertificateVerifyView,
    MemberCertificatesView,
)

urlpatterns = [
    # Certificados
    path("", CertificateListCreateView.as_view(), name="certificate_list_create"),
    path("<int:pk>/", CertificateDetailView.as_view(), name="certificate_detail"),
    path("<int:pk>/approval/", CertificateApprovalView.as_view(), name="certificate_approval"),

    # Verificação pública por hash
    path("verify/<str:auth_hash>/", CertificateVerifyView.as_view(), name="certificate_verify"),

    # Certificados de um membro específico
    path("members/<int:pk>/", MemberCertificatesView.as_view(), name="member_certificates"),
]