from django.db.models.signals import pre_save
from django.dispatch import receiver
from members.models import Member
from .models import MemberHistory


@receiver(pre_save, sender=Member)
def registrar_historico_membro(sender, instance, **kwargs):
    """
    Gatilho disparado antes de salvar um Member.
    Detecta mudanças de status e registra automaticamente no histórico.
    """

    # Se o membro ainda não existe no banco (criação), não faz nada
    if not instance.pk:
        return

    try:
        anterior = Member.objects.get(pk=instance.pk)
    except Member.DoesNotExist:
        return

    status_anterior = anterior.status
    status_novo = instance.status

    # Sem mudança de status → não registra
    if status_anterior == status_novo:
        return

    # ── ATIVO → INATIVO: registra saída ──────────────────────────────────────
    if status_anterior == Member.Status.ACTIVE and status_novo == Member.Status.INACTIVE:
        # Fecha o período aberto mais recente (se existir)
        periodo_aberto = (
            MemberHistory.objects
            .filter(member=instance, exit_date__isnull=True)
            .order_by("-entry_date")
            .first()
        )
        if periodo_aberto:
            periodo_aberto.exit_date = instance.exit_date or anterior.entry_date
            periodo_aberto.save()

        MemberHistory.objects.create(
            member=instance,
            reason=MemberHistory.Reason.EXIT,
            entry_date=anterior.entry_date,
            exit_date=instance.exit_date,
            notes=f"Status alterado de Ativo para Inativo.",
        )

    # ── ATIVO → SUSPENSO: registra suspensão ─────────────────────────────────
    elif status_anterior == Member.Status.ACTIVE and status_novo == Member.Status.SUSPENDED:
        MemberHistory.objects.create(
            member=instance,
            reason=MemberHistory.Reason.SUSPENSION,
            entry_date=anterior.entry_date,
            exit_date=instance.exit_date,
            notes=f"Status alterado de Ativo para Suspenso.",
        )

    # ── INATIVO/SUSPENSO → ATIVO: registra reentrada ─────────────────────────
    elif status_anterior in (Member.Status.INACTIVE, Member.Status.SUSPENDED) and status_novo == Member.Status.ACTIVE:
        MemberHistory.objects.create(
            member=instance,
            reason=MemberHistory.Reason.REENTRY,
            entry_date=instance.entry_date,
            exit_date=None,
            notes=f"Status alterado de {anterior.get_status_display()} para Ativo.",
        )