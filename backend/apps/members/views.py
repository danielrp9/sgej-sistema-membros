from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone

from accounts.permissions import IsAdmin, IsAdminOrReadOnly, IsAdminOrViewer
from .models import Member
from .serializers import MemberSerializer, MemberListSerializer
from certificates.models import Certificate
from core.mixins import AuditLogMixin

class MemberListCreateView(AuditLogMixin, generics.ListCreateAPIView):
    """Lista e cria membros com suporte a auditoria e filtros."""
    audit_model_name = "Member"
    queryset = Member.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "email", "registration"]
    ordering_fields = ["name", "entry_date", "status"]
    ordering = ["name"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAdmin()]
        return [IsAdminOrViewer()]

    def get_serializer_class(self):
        if self.request.method == "GET":
            return MemberListSerializer
        return MemberSerializer

    def get_queryset(self):
        queryset = Member.objects.all()
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        entry_from = self.request.query_params.get("entry_from")
        entry_to = self.request.query_params.get("entry_to")
        if entry_from:
            queryset = queryset.filter(entry_date__gte=entry_from)
        if entry_to:
            queryset = queryset.filter(entry_date__lte=entry_to)
        return queryset

class MemberDetailView(AuditLogMixin, generics.RetrieveUpdateDestroyAPIView):
    """Visualiza, edita ou deleta um membro específico."""
    audit_model_name = "Member"
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminOrReadOnly]

class MemberStatsView(APIView):
    """Retorna contagem de membros por status para o dashboard."""
    permission_classes = [IsAdminOrViewer]

    def get(self, request):
        total = Member.objects.count()
        active = Member.objects.filter(status=Member.Status.ACTIVE).count()
        inactive = Member.objects.filter(status=Member.Status.INACTIVE).count()
        suspended = Member.objects.filter(status=Member.Status.SUSPENDED).count()

        return Response({
            "total": total,
            "active": active,
            "inactive": inactive,
            "suspended": suspended,
        })

class MemberHistoryView(APIView):
    """
    Retorna o histórico de permanência de um membro específico.
    ESSENCIAL: Retorna sempre uma lista [] para evitar erro de .map() no frontend.
    """
    permission_classes = [IsAdminOrViewer]

    def get(self, request, pk):
        try:
            member = Member.objects.get(pk=pk)
            
            history_data = [
                {
                    "id": member.id,
                    "reason_display": "Ciclo de Atividades",
                    "entry_date": member.entry_date,
                    "exit_date": member.exit_date,
                    "tempo_permanencia": {
                        "display": "Ativo" if not member.exit_date else "Finalizado"
                    },
                    "notes": f"Atuando como {member.role or 'Colaborador'} no departamento {member.department or 'Geral'}."
                }
            ]
            return Response(history_data, status=status.HTTP_200_OK)
        except Member.DoesNotExist:
            return Response([], status=status.HTTP_200_OK)

class MemberTerminateView(APIView):
    """
    POST /api/v1/members/{id}/terminate/
    Encerra atividades do membro, calcula horas (6h/semanais)
    e gera o rascunho do certificado.
    """
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        try:
            member = Member.objects.get(pk=pk)
            
            if member.status == Member.Status.INACTIVE:
                return Response(
                    {"detail": "Este membro já possui atividades encerradas."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            member.exit_date = timezone.now().date()
            member.status = Member.Status.INACTIVE
            member.save()

            total_hours = member.calculate_total_hours()

            role = member.role or "Colaborador"
            dept = member.department or "Geral"
            
            description = (
                f"integrou a equipe da empresa exercendo o cargo de {role}, "
                f"no Departamento {dept}, no período de "
                f"{member.entry_date.strftime('%d/%m/%Y')} à {member.exit_date.strftime('%d/%m/%Y')}, "
                f"totalizando {total_hours} horas de trabalho voluntário."
            )

            certificate = Certificate.objects.create(
                member=member,
                title=f"Certificado de Participação - {member.name}",
                description=description,
                status='PENDING'
            )

            return Response({
                "message": "Atividades encerradas e certificado gerado.",
                "total_hours": total_hours,
                "certificate_id": certificate.id
            }, status=status.HTTP_200_OK)

        except Member.DoesNotExist:
            return Response({"detail": "Membro não encontrado."}, status=status.HTTP_404_NOT_FOUND)