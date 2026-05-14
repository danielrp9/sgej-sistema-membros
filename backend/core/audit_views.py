from rest_framework import generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import serializers

from accounts.permissions import IsAdmin
from core.models import AuditLog



class AuditLogSerializer(serializers.ModelSerializer):
    action_display = serializers.CharField(source="get_action_display", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "id",
            "user_email",
            "user_role",
            "action",
            "action_display",
            "model_name",
            "object_id",
            "object_repr",
            "changes",
            "ip_address",
            "endpoint",
            "method",
            "created_at",
        ]



class AuditLogListView(generics.ListAPIView):
    """
    GET /api/v1/audit/
    Lista todos os logs de auditoria — apenas ADMIN.
    Suporta filtros por ação, model e busca por e-mail.
    """
    queryset = AuditLog.objects.all()
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdmin]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["user_email", "model_name", "object_repr", "endpoint"]
    ordering_fields = ["created_at", "action", "model_name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = AuditLog.objects.all()

        action = self.request.query_params.get("action")
        if action:
            queryset = queryset.filter(action=action.upper())

        model = self.request.query_params.get("model")
        if model:
            queryset = queryset.filter(model_name__icontains=model)

        return queryset


class AuditLogStatsView(APIView):
    """
    GET /api/v1/audit/stats/
    Contagem de ações por tipo — apenas ADMIN.
    """
    permission_classes = [IsAdmin]

    def get(self, request):
        from django.db.models import Count
        stats = (
            AuditLog.objects
            .values("action")
            .annotate(total=Count("id"))
            .order_by("-total")
        )
        return Response({
            "totals": list(stats),
            "grand_total": AuditLog.objects.count(),
        })