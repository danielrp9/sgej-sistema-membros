import hashlib
import uuid
from django.db import models
from django.utils import timezone


class Certificate(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendente"
        APPROVED = "APPROVED", "Aprovado"
        REJECTED = "REJECTED", "Rejeitado"

    member = models.ForeignKey(
        "members.Member",
        on_delete=models.CASCADE,
        related_name="certificates",
        verbose_name="Membro",
    )
    approved_by = models.ForeignKey(
        "accounts.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_certificates",
        verbose_name="Aprovado por",
        limit_choices_to={"role": "VIEWER"},  # apenas Orientadora pode aprovar
    )

    title = models.CharField("Título", max_length=200)
    description = models.TextField("Descrição", blank=True)
    issue_date = models.DateField("Data de Emissão", null=True, blank=True)

    is_approved = models.BooleanField("Aprovado", default=False)
    status = models.CharField(
        "Status",
        max_length=10,
        choices=Status.choices,
        default=Status.PENDING,
    )
    approved_at = models.DateTimeField("Aprovado em", null=True, blank=True)
    rejection_reason = models.TextField("Motivo da Rejeição", blank=True)

    auth_hash = models.CharField(
        "Hash de Autenticidade",
        max_length=64,
        unique=True,
        blank=True,
    )
    auth_uuid = models.UUIDField(
        "UUID de Verificação",
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )

    created_at = models.DateTimeField("Criado em", auto_now_add=True)
    updated_at = models.DateTimeField("Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Certificado"
        verbose_name_plural = "Certificados"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} — {self.member.name}"

    def generate_auth_hash(self):
        """
        Gera um hash SHA-256 único baseado em:
        - UUID do certificado
        - ID do membro
        - Matrícula do membro
        - Título do certificado
        - Timestamp de criação

        Garante autenticidade e impossibilidade de falsificação.
        """
        raw = (
            f"{self.auth_uuid}"
            f"{self.member.id}"
            f"{self.member.registration}"
            f"{self.title}"
            f"{self.created_at or timezone.now()}"
        )
        return hashlib.sha256(raw.encode()).hexdigest()

    def save(self, *args, **kwargs):
        if not self.auth_hash:
            super().save(*args, **kwargs)
            self.auth_hash = self.generate_auth_hash()
            kwargs["force_insert"] = False

        if self.status == self.Status.APPROVED:
            self.is_approved = True
            if not self.issue_date:
                self.issue_date = timezone.now().date()
        else:
            self.is_approved = False

        super().save(*args, **kwargs)

    def approve(self, user):
        """Aprova o certificado. Deve ser chamado pela Orientadora (VIEWER)."""
        self.status = self.Status.APPROVED
        self.is_approved = True
        self.approved_by = user
        self.approved_at = timezone.now()
        self.issue_date = timezone.now().date()
        self.rejection_reason = ""
        self.save()

    def reject(self, user, reason=""):
        """Rejeita o certificado com motivo opcional."""
        self.status = self.Status.REJECTED
        self.is_approved = False
        self.approved_by = user
        self.approved_at = timezone.now()
        self.rejection_reason = reason
        self.save()