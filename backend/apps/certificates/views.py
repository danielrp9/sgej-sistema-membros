from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action

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
    """
    Lista todos os certificados e permite a criação manual.
    Vincula o usuário logado como autor do registro.
    """
    queryset = Certificate.objects.select_related("member", "approved_by").all()
    audit_model_name = "Certificate"

    def get_permissions(self):
        return [IsAdminOrViewer()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CertificateCreateSerializer
        return CertificateSerializer

    def perform_create(self, serializer):
        try:
            serializer.save(created_by=self.request.user)
        except TypeError:
            serializer.save()

class CertificatePendingSignatureView(generics.ListAPIView):
    """
    Retorna a fila de rascunhos aguardando assinatura.
    Endpoint consumido pelo Audit.jsx: GET /api/v1/certificates/pending-signature/
    """
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return Certificate.objects.filter(
            status=Certificate.Status.PENDING
        ).select_related("member", "approved_by")

class CertificateDetailView(generics.RetrieveDestroyAPIView):
    """
    GET    -> Detalha informações de um certificado.
    DELETE -> Remove um certificado (Apenas Admin).
    """
    queryset = Certificate.objects.select_related("member", "approved_by").all()
    serializer_class = CertificateSerializer

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAdmin()]
        return [IsAdminOrViewer()]

class CertificateApprovalView(APIView):
    """
    ✅ Lógica de Assinatura Digital (Aprovação ou Rejeição).
    Endpoint: POST /api/v1/certificates/{id}/approval/
    """
    permission_classes = [IsAdminOrViewer] 

    def post(self, request, pk):
        try:
            certificate = Certificate.objects.get(pk=pk)
        except Certificate.DoesNotExist:
            return Response({"detail": "Certificado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if certificate.status == Certificate.Status.APPROVED:
            return Response({"detail": "Este certificado já possui uma assinatura válida."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CertificateApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action_type = serializer.validated_data["action"]
        reason = serializer.validated_data.get("rejection_reason", "")

        if action_type == "approve":
            certificate.approve(user=request.user)
            return Response({
                "detail": "Certificado assinado com sucesso.",
                "auth_hash": certificate.auth_hash,
                "issue_date": certificate.issue_date,
            }, status=status.HTTP_200_OK)

        certificate.reject(user=request.user, reason=reason)
        return Response({"detail": "Certificado rejeitado e rascunho invalidado."}, status=status.HTTP_200_OK)

class CertificateVerifyView(APIView):
    """
    Endpoint público para verificação de autenticidade via UUID ou Hash.
    """
    permission_classes = [AllowAny]

    def get(self, request, auth_hash):
        try:
            certificate = Certificate.objects.select_related("member", "approved_by").get(auth_hash=auth_hash)
        except Certificate.DoesNotExist:
            return Response({"valid": False, "detail": "Documento não encontrado na base oficial SGEJ."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CertificatePublicSerializer(certificate)
        return Response({
            "valid": certificate.is_approved,
            "certificate": serializer.data,
        })

class MemberCertificatesView(generics.ListAPIView):
    """
    Lista todos os certificados vinculados a um membro específico.
    """
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return Certificate.objects.filter(member_id=self.kwargs["pk"]).select_related("member", "approved_by")