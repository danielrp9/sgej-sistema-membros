from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class AuditLog(models.Model):

    class Action(models.TextChoices):
        CREATE = "CREATE", "Criação"
        UPDATE = "UPDATE", "Atualização"
        DELETE = "DELETE", "Exclusão"
        LOGIN  = "LOGIN",  "Login"
        LOGOUT = "LOGOUT", "Logout"
        APPROVE = "APPROVE", "Aprovação"
        REJECT  = "REJECT",  "Rejeição"

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="audit_logs",
        verbose_name="Usuário",
    )
    user_email = models.EmailField("E-mail do usuário", blank=True)
    user_role = models.CharField("Role do usuário", max_length=10, blank=True)

    action = models.CharField("Ação", max_length=10, choices=Action.choices)
    model_name = models.CharField("Model", max_length=100, blank=True)
    object_id = models.CharField("ID do objeto", max_length=50, blank=True)
    object_repr = models.CharField("Representação do objeto", max_length=255, blank=True)

    changes = models.JSONField("Alterações", default=dict, blank=True)

    ip_address = models.GenericIPAddressField("IP", null=True, blank=True)
    user_agent = models.CharField("User-Agent", max_length=255, blank=True)
    endpoint = models.CharField("Endpoint", max_length=255, blank=True)
    method = models.CharField("Método HTTP", max_length=10, blank=True)

    created_at = models.DateTimeField("Data/hora", auto_now_add=True)

    class Meta:
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.action}] {self.user_email} → {self.model_name} #{self.object_id}"