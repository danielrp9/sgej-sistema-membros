from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    """Manager personalizado para login via e-mail."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("O e-mail é obrigatório.")
        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.PRESIDENT)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser deve ter is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser deve ter is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):

    class Role(models.TextChoices):
        RH = "director", "Recursos Humanos - RH"
        PRESIDENT = "president", "Presidente"
        COORDINATOR = "orientador", "Coordenador(a)"

    username = None

    email = models.EmailField("E-mail", unique=True)
    role = models.CharField(
        "Nível de acesso",
        max_length=15,
        choices=Role.choices,
        default=Role.RH,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ["email"]

    def __str__(self):
        return f"{self.email} ({self.get_role_display()})"

    def save(self, *args, **kwargs):
        """
        Garante concessão automática de privilégios de acesso ao sistema
        com base no cargo atribuído ao usuário.
        """
        if self.role in [self.Role.PRESIDENT, self.Role.RH]:
            self.is_staff = True
        else:
            self.is_staff = False
            
        super().save(*args, **kwargs)

    @property
    def is_president(self):
        return self.role == self.Role.PRESIDENT

    @property
    def is_rh(self):
        return self.role == self.Role.RH

    @property
    def is_coordinator(self):
        return self.role == self.Role.COORDINATOR