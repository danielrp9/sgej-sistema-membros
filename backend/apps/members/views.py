from rest_framework import generics, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin, IsAdminOrReadOnly, IsAdminOrViewer
from .models import Member
from .serializers import MemberSerializer, MemberListSerializer
from core.mixins import AuditLogMixin


class MemberListCreateView(AuditLogMixin, generics.ListCreateAPIView):

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

        # Filtro por status
        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status=status_param.upper())

        # Filtro por data de entrada (intervalo)
        entry_from = self.request.query_params.get("entry_from")
        entry_to = self.request.query_params.get("entry_to")
        if entry_from:
            queryset = queryset.filter(entry_date__gte=entry_from)
        if entry_to:
            queryset = queryset.filter(entry_date__lte=entry_to)

        return queryset


class MemberDetailView(AuditLogMixin, generics.RetrieveUpdateDestroyAPIView):

    audit_model_name = "Member"
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [IsAdminOrReadOnly]


class MemberStatsView(APIView):
    """Retorna contagem de membros por status."""
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