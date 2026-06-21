import uuid
import hashlib
from django.db import models
from django.conf import settings
from django.utils import timezone
from members.models import Member


class Certificate(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Pendente"
        PARTIAL = "PARTIAL", "Assinado Parcialmente"
        APPROVED = "APPROVED", "Aprovado e Emitido"
        REJECTED = "REJECTED", "Rejeitado"

    member = models.ForeignKey(
        Member, 
        on_delete=models.CASCADE, 
        related_name="certificates",
        verbose_name="Membro Colaborador"
    )
    title = models.CharField("Título", max_length=255)
    description = models.TextField("Descrição/Conteúdo do Certificado")
    

    status = models.CharField(
        "Status do Fluxo",
        max_length=15,
        choices=Status.choices,
        default=Status.PENDING,
    )
    is_approved = models.BooleanField("Está Totalmente Válido?", default=False)
    rejection_reason = models.TextField("Motivo da Rejeição", blank=True, default="")
    
    # Identificadores Únicos de Autenticidade
    auth_uuid = models.UUIDField("UUID de Verificação", default=uuid.uuid4, unique=True, editable=False)
    auth_hash = models.CharField("Hash de Autenticidade Global", max_length=64, unique=True, blank=True, null=True)
    
    issue_date = models.DateField("Data de Emissão Oficial", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Slot 1: Diretor de RH (director)
    signed_by_director = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="signed_certificates_director",
        verbose_name="Assinado por (RH)"
    )
    signed_at_director = models.DateTimeField("Data/Hora Assinatura (RH)", blank=True, null=True)

    # Slot 2: Coordenador/Orientador (orientador)
    signed_by_orientador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="signed_certificates_orientador",
        verbose_name="Assinado por (Coordenação)"
    )
    signed_at_orientador = models.DateTimeField("Data/Hora Assinatura (Coordenação)", blank=True, null=True)

    # Slot 3: Presidente (president)
    signed_by_president = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="signed_certificates_president",
        verbose_name="Assinado por (Presidência)"
    )
    signed_at_president = models.DateTimeField("Data/Hora Assinatura (Presidência)", blank=True, null=True)

    class Meta:
        verbose_name = "Certificado"
        verbose_name_plural = "Certificados"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.member.name} ({self.get_status_display()})"

    def collect_signature(self, user, role):
        """
        Registra a assinatura no slot correspondente de forma independente de ordem
        e calcula dinamicamente o status do fluxo do documento.
        """
        if self.status == self.Status.APPROVED:
            return

        now = timezone.now()

   
        if role == "director":
            self.signed_by_director = user
            self.signed_at_director = now
        elif role == "orientador":
            self.signed_by_orientador = user
            self.signed_at_orientador = now
        elif role == "president":
            self.signed_by_president = user
            self.signed_at_president = now


        signatures_count = sum([
            1 if self.signed_by_director else 0,
            1 if self.signed_by_orientador else 0,
            1 if self.signed_by_president else 0
        ])

        if signatures_count == 3:
        
            self.status = self.Status.APPROVED
            self.is_approved = True
            self.issue_date = now.date()
            self.auth_hash = self.generate_blockchain_hash()
        elif signatures_count > 0:
     
            self.status = self.Status.PARTIAL
            self.is_approved = False
        else:
            self.status = self.Status.PENDING
            self.is_approved = False

        self.save()

    def reject(self, user, reason):
        """
        Invalida o rascunho por completo em caso de rejeição de auditoria.
        """
        self.status = self.Status.REJECTED
        self.is_approved = False
        self.rejection_reason = reason
        

        self.signed_by_director = None
        self.signed_at_director = None
        self.signed_by_orientador = None
        self.signed_at_orientador = None
        self.signed_by_president = None
        self.signed_at_president = None
        self.auth_hash = None
        
        self.save()

    def generate_blockchain_hash(self):
        """
        Gera o código SHA256 irreproduzível vinculando os metadados técnicos,
        as credenciais das 3 assinaturas e a identificação do estudante voluntário.
        """
        salt_string = (
            f"{self.auth_uuid}-"
            f"{self.member.registration}-"
            f"{self.signed_by_director_id}-"
            f"{self.signed_by_orientador_id}-"
            f"{self.signed_by_president_id}-"
            f"{self.issue_date.strftime('%Y%m%d')}"
        )
        return hashlib.sha256(salt_string.encode("utf-8")).hexdigest().upper()


from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Certificate)
def create_certificate_notifications(sender, instance, created, **kwargs):
    if created and instance.status == Certificate.Status.PENDING:
        from django.contrib.auth import get_user_model
        from accounts.models import Notification
        
        User = get_user_model()
        users = User.objects.filter(role__in=["president", "orientador", "director"], is_active=True)
        
        for user in users:
            Notification.objects.create(
                user=user,
                title="Assinatura Pendente",
                message=f"O certificado de {instance.member.name} foi gerado e precisa de sua assinatura.",
                certificate_id=instance.id
            )