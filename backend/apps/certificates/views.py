import uuid
from django.db.models import Q
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from core.mixins import AuditLogMixin
from accounts.permissions import IsAdmin, IsAdminOrViewer
from .models import Certificate
from .serializers import (
    CertificateApprovalSerializer,
    CertificateCreateSerializer,
    CertificatePublicSerializer,
    CertificateSerializer,
)

class CertificateListCreateView(generics.ListCreateAPIView, AuditLogMixin):
    """
    Lista todos os certificados e permite a criação manual pelo painel.
    """
    queryset = Certificate.objects.select_related("member", "signed_by_president", "signed_by_director", "signed_by_orientador").all()
    audit_model_name = "Certificate"

    def get_permissions(self):
        return [IsAdminOrViewer()]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CertificateCreateSerializer
        return CertificateSerializer

    def perform_create(self, serializer):
        serializer.save()

class CertificatePendingSignatureView(generics.ListAPIView):
    """
    Retorna a fila de rascunhos pendentes ou parciais para auditoria.
    Filtra qualquer um que não esteja totalmente aprovado ou rejeitado.
    """
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return Certificate.objects.filter(
            status__in=[Certificate.Status.PENDING, Certificate.Status.PARTIAL]
        ).select_related("member", "signed_by_president", "signed_by_director", "signed_by_orientador")

class CertificateDetailView(generics.RetrieveDestroyAPIView):
    """
    Detalha ou remove um registro de certificado específico.
    """
    queryset = Certificate.objects.select_related("member", "signed_by_president", "signed_by_director", "signed_by_orientador").all()
    serializer_class = CertificateSerializer

    def get_permissions(self):
        if self.request.method == "DELETE":
            return [IsAdmin()]
        return [IsAdminOrViewer()]

class CertificateApprovalView(APIView):
    """
    Coleta assinaturas digitais cumulativas de forma assíncrona.
    Endpoint: POST /api/v1/certificates/{id}/approval/
    """
    permission_classes = [IsAdminOrViewer] 

    def post(self, request, pk):
        try:
            certificate = Certificate.objects.get(pk=pk)
        except Certificate.DoesNotExist:
            return Response({"detail": "Certificado não encontrado."}, status=status.HTTP_404_NOT_FOUND)

        if certificate.status == Certificate.Status.APPROVED:
            return Response({"detail": "Este certificado já concluiu o fluxo de assinaturas e foi selado."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CertificateApprovalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action_type = serializer.validated_data["action"]
        role = serializer.validated_data.get("role")
        reason = serializer.validated_data.get("reason", "")

        if action_type == "approve":
            if not role:
                return Response({"detail": "Identifique a role correspondente para assinar."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Executa a coleta no respectivo slot do modelo
            certificate.collect_signature(user=request.user, role=role)
            return Response({
                "detail": f"Assinatura como {role} registrada com sucesso.",
                "status": certificate.status,
                "is_approved": certificate.is_approved,
                "auth_hash": certificate.auth_hash
            }, status=status.HTTP_200_OK)

    
        certificate.reject(user=request.user, reason=reason)
        return Response({"detail": "Certificado rejeitado e assinaturas parciais limpas."}, status=status.HTTP_200_OK)

class CertificateVerifyView(APIView):
    """
    Endpoint público consultado pelo validador hash ou QR code.
    Suporta de forma inteligente buscas tanto pelo auth_hash quanto pelo auth_uuid.
    """
    permission_classes = [AllowAny]

    def get(self, request, auth_hash):
        lookup_value = auth_hash.strip()

        try:
            if len(lookup_value) == 64:
                certificate = Certificate.objects.select_related(
                    "member", "signed_by_president", "signed_by_director", "signed_by_orientador"
                ).get(
                    Q(auth_hash=lookup_value.lower()) | 
                    Q(auth_hash=lookup_value.upper()) |
                    Q(auth_hash__iexact=lookup_value)
                )
            
            else:
                # 2. Caso contrário, tenta efetuar a busca pelo UUID do rascunho provisório
                try:
                    uuid_obj = uuid.UUID(lookup_value)
                    certificate = Certificate.objects.select_related(
                        "member", "signed_by_president", "signed_by_director", "signed_by_orientador"
                ).get(auth_uuid=uuid_obj)
                except (ValueError, TypeError):
                    raise Certificate.DoesNotExist

        except Certificate.DoesNotExist:
            return Response({
                "valid": False, 
                "detail": "Documento não encontrado na base oficial SGEJ."
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = CertificatePublicSerializer(certificate)
        return Response({
            "valid": certificate.is_approved,
            "certificate": serializer.data,
        })

class MemberCertificatesView(generics.ListAPIView):
    """
    Retorna todos os certificados emitidos a um membro.
    """
    serializer_class = CertificateSerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return Certificate.objects.filter(member_id=self.kwargs["pk"]).select_related(
            "member", "signed_by_president", "signed_by_director", "signed_by_orientador"
        )


class CertificateStatsView(APIView):
    """
    Retorna estatísticas quantitativas dos certificados criados no ano vigente para o dashboard.
    """
    permission_classes = [IsAdminOrViewer]

    def get(self, request):
        from django.utils import timezone
        current_year = timezone.now().year
        
        year_certs = Certificate.objects.filter(created_at__year=current_year)
        total = year_certs.count()
        partial = year_certs.filter(status=Certificate.Status.PARTIAL).count()
        approved = year_certs.filter(status=Certificate.Status.APPROVED).count()

        return Response({
            "year": current_year,
            "total": total,
            "partial": partial,
            "approved": approved,
        })