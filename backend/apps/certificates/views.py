from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.mixins import AuditLogMixin

from accounts.permissions import IsAdmin, IsAdminOrViewer, IsViewer
from .models import Certificate
from .serializers import (
    CertificateApprovalSerializer,
    CertificateCreateSerializer,
    CertificatePublicSerializer,
    CertificateSerializer,
)


class CertificateListCreateView(generics.ListCreateAPIView, AuditLogMixin):

    queryset = Certificate.objects.select_related("member", "approved_by").all()
    audit_model_name = "Certificate"

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdmin()]
        return [IsAdminOrViewer()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CertificateCreateSerializer
        return CertificateSerializer


class CertificateDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    → Detalha certificado (ADMIN e VIEWER).
    DELETE → Remove certificado (apenas ADMIN).
    """
    queryset = Certificate.objects.select_related("member", "approved_by").all()
    serializer_class = CertificateSerializer

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAdmin()]
        return [IsAdminOrViewer()]


class CertificateApprovalView(APIView):
    """
    POST /api/v1/certificates/{id}/approval/
    Aprovação ou rejeição do certificado — apenas VIEWER (Orientadora).
    """
    permission_classes = [IsViewer]

    def post(self, request, pk):
        try:
            certificate = Certificate.objects.get(pk=pk)
        except Certificate.DoesNotExist:
            return Response({"detail": "Certificado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if certificate.status == Certificate.Status.APPROVED:
            return Response(
                {"detail": "Este certificado já foi aprovado."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = CertificateApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data["action"]
        reason = serializer.validated_data.get("rejection_reason", "")

        if action == "approve":
            certificate.approve(user=request.user)
            return Response(
                {
                    "detail": "Certificado aprovado com sucesso.",
                    "auth_hash": certificate.auth_hash,
                    "issue_date": certificate.issue_date,
                },
                status=status.HTTP_200_OK,
            )

        certificate.reject(user=request.user, reason=reason)
        return Response(
            {"detail": "Certificado rejeitado.", "reason": reason},
            status=status.HTTP_200_OK,
        )


class CertificateVerifyView(APIView):
    """
    GET /api/v1/certificates/verify/{hash}/
    Endpoint público — verifica autenticidade pelo hash e entrega os dados formatados.
    Não exige autenticação (pode ser acessado por qualquer pessoa).
    """
    permission_classes = [AllowAny]

    def get(self, request, auth_hash):
        try:
            certificate = Certificate.objects.select_related(
                "member", "approved_by"
            ).get(auth_hash=auth_hash)
        except Certificate.DoesNotExist:
            return Response(
                {"valid": False, "detail": "Certificado não encontrado ou hash inválido."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CertificatePublicSerializer(certificate)
        return Response({
            "valid": certificate.is_approved,
            "certificate": serializer.data,
        })


class MemberCertificatesView(generics.ListAPIView):
    """
    GET /api/v1/members/{id}/certificates/
    Lista todos os certificados de um membro específico.
    """
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return Certificate.objects.filter(
            member_id=self.kwargs["pk"]
        ).select_related("member", "approved_by")