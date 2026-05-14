from django.urls import path
from .views import (
    CertificateListCreateView,
    CertificateDetailView,
    CertificateApprovalView,
    CertificateVerifyView,
    MemberCertificatesView,
    CertificatePendingSignatureView, # ✅ Importada a nova View
)

urlpatterns = [
    path("pending-signature/", CertificatePendingSignatureView.as_view(), name="certificate_pending_signature"),

    path("", CertificateListCreateView.as_view(), name="certificate_list_create"),
    path("<int:pk>/", CertificateDetailView.as_view(), name="certificate_detail"),
    path("<int:pk>/approval/", CertificateApprovalView.as_view(), name="certificate_approval"),

    path("verify/<str:auth_hash>/", CertificateVerifyView.as_view(), name="certificate_verify"),

    path("members/<int:pk>/", MemberCertificatesView.as_view(), name="member_certificates"),
]