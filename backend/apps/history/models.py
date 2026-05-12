from django.db import models
from django.utils import timezone


class MemberHistory(models.Model):

    class Reason(models.TextChoices):
        EXIT = "EXIT", "Saída"
        SUSPENSION = "SUSPENSION", "Suspensão"
        REENTRY = "REENTRY", "Reentrada"

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.CASCADE,
        related_name="history",
        verbose_name="Membro",
    )
    reason = models.CharField(
        "Motivo",
        max_length=15,
        choices=Reason.choices,
    )
    entry_date = models.DateField("Data de Entrada do Período")
    exit_date = models.DateField("Data de Saída do Período", null=True, blank=True)
    notes = models.TextField("Observações", blank=True)
    created_at = models.DateTimeField("Registrado em", auto_now_add=True)

    class Meta:
        verbose_name = "Histórico"
        verbose_name_plural = "Históricos"
        ordering = ["-entry_date"]

    def __str__(self):
        return f"{self.member.name} — {self.get_reason_display()} ({self.entry_date})"

    @property
    def tempo_permanencia(self):
        """
        Calcula o tempo de permanência do período.
        Se ainda não tem exit_date, calcula até hoje.
        Retorna um dict com dias, meses e anos.
        """
        end = self.exit_date if self.exit_date else timezone.now().date()
        delta = end - self.entry_date
        total_days = delta.days

        years = total_days // 365
        months = (total_days % 365) // 30
        days = (total_days % 365) % 30

        return {
            "total_days": total_days,
            "years": years,
            "months": months,
            "days": days,
            "display": self._format_display(years, months, days),
        }

    def _format_display(self, years, months, days):
        parts = []
        if years:
            parts.append(f"{years} ano{'s' if years > 1 else ''}")
        if months:
            parts.append(f"{months} {'meses' if months > 1 else 'mês'}")
        if days:
            parts.append(f"{days} dia{'s' if days > 1 else ''}")
        return ", ".join(parts) if parts else "Menos de 1 dia"