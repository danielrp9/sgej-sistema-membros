from django.db import models


class Member(models.Model):

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Ativo"
        INACTIVE = "INACTIVE", "Inativo"
        SUSPENDED = "SUSPENDED", "Suspenso"

    name = models.CharField("Nome", max_length=150)
    email = models.EmailField("E-mail", unique=True)
    registration = models.CharField("Matrícula", max_length=20, unique=True)
    entry_date = models.DateField("Data de Entrada")
    exit_date = models.DateField("Data de Saída", null=True, blank=True)
    status = models.CharField(
        "Status",
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    created_at = models.DateTimeField("Criado em", auto_now_add=True)
    updated_at = models.DateTimeField("Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Membro"
        verbose_name_plural = "Membros"
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.registration})"