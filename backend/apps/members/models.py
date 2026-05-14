from django.db import models
from datetime import date

class Member(models.Model):
    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Ativo"
        INACTIVE = "INACTIVE", "Inativo"
        SUSPENDED = "SUSPENDED", "Suspenso"

    name = models.CharField("Nome", max_length=150)
    email = models.EmailField("E-mail", unique=True)
    cpf = models.CharField("CPF", max_length=14, unique=True, null=True)
    registration = models.CharField("Matrícula", max_length=20, unique=True)
    
    course = models.CharField("Curso", max_length=100, default="Sistemas de Informação")
    role = models.CharField("Cargo", max_length=100, null=True)
    department = models.CharField("Departamento", max_length=100, null=True)
    
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

    def calculate_total_hours(self):
        """
        Calcula horas totais: 6h por semana entre entrada e saída.
        Garante o mínimo de 6h (1 semana) caso o período seja muito curto.
        """
        end_date = self.exit_date or date.today()
        delta = end_date - self.entry_date
        weeks = max(delta.days // 7, 1)
        return weeks * 6

    def __str__(self):
        return f"{self.name} ({self.registration})"