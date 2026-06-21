from django.urls import path, re_path
from .views import (
    CertificateListCreateView,
    CertificateDetailView,
    CertificateApprovalView,
    CertificateVerifyView,
    MemberCertificatesView,
    CertificatePendingSignatureView,
    CertificateStatsView,
)

app_name = "certificates"

urlpatterns = [
    path(
        "stats/",
        CertificateStatsView.as_view(),
        name="stats"
    ),
    path(
        "pending-signature/", 
        CertificatePendingSignatureView.as_view(), 
        name="pending-signature"
    ),



    path(
        "", 
        CertificateListCreateView.as_view(), 
        name="list-create"
    ),
    

    path(
        "<int:pk>/", 
        CertificateDetailView.as_view(), 
        name="detail"
    ),
    
    path(
        "<int:pk>/approval/", 
        CertificateApprovalView.as_view(), 
        name="approval"
    ),


    re_path(
        r'^public/verify/(?P<auth_hash>[\w-]+)/?$', 
        CertificateVerifyView.as_view(), 
        name="verify"
    ),

    path(
        "member/<int:pk>/", 
        MemberCertificatesView.as_view(), 
        name="member-certificates"
    ),
]