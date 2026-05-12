from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdminOrViewer
from members.models import Member
from .models import MemberHistory
from .serializers import MemberHistorySerializer


class MemberHistoryListView(generics.ListAPIView):
    """
    GET /api/v1/members/{id}/history/
    Lista todo o histórico de um membro específico.
    """
    serializer_class = MemberHistorySerializer
    permission_classes = [IsAdminOrViewer]

    def get_queryset(self):
        return MemberHistory.objects.filter(
            member_id=self.kwargs["pk"]
        ).select_related("member")


class MemberHistorySummaryView(APIView):
    """
    GET /api/v1/members/{id}/history/summary/
    Retorna o tempo total de permanência consolidado do membro.
    """
    permission_classes = [IsAdminOrViewer]

    def get(self, request, pk):
        member = Member.objects.get(pk=pk)
        historicos = MemberHistory.objects.filter(member=member)

        total_dias = sum(
            h.tempo_permanencia["total_days"] for h in historicos
        )

        anos = total_dias // 365
        meses = (total_dias % 365) // 30
        dias = (total_dias % 365) % 30

        return Response({
            "member_id": member.pk,
            "member_name": member.name,
            "total_periodos": historicos.count(),
            "tempo_total": {
                "total_days": total_dias,
                "years": anos,
                "months": meses,
                "days": dias,
                "display": self._format(anos, meses, dias),
            },
        })

    def _format(self, years, months, days):
        parts = []
        if years:
            parts.append(f"{years} ano{'s' if years > 1 else ''}")
        if months:
            parts.append(f"{months} {'meses' if months > 1 else 'mês'}")
        if days:
            parts.append(f"{days} dia{'s' if days > 1 else ''}")
        return ", ".join(parts) if parts else "Sem histórico"