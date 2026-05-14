
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_email', models.EmailField(blank=True, max_length=254, verbose_name='E-mail do usuário')),
                ('user_role', models.CharField(blank=True, max_length=10, verbose_name='Role do usuário')),
                ('action', models.CharField(choices=[('CREATE', 'Criação'), ('UPDATE', 'Atualização'), ('DELETE', 'Exclusão'), ('LOGIN', 'Login'), ('LOGOUT', 'Logout'), ('APPROVE', 'Aprovação'), ('REJECT', 'Rejeição')], max_length=10, verbose_name='Ação')),
                ('model_name', models.CharField(blank=True, max_length=100, verbose_name='Model')),
                ('object_id', models.CharField(blank=True, max_length=50, verbose_name='ID do objeto')),
                ('object_repr', models.CharField(blank=True, max_length=255, verbose_name='Representação do objeto')),
                ('changes', models.JSONField(blank=True, default=dict, verbose_name='Alterações')),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True, verbose_name='IP')),
                ('user_agent', models.CharField(blank=True, max_length=255, verbose_name='User-Agent')),
                ('endpoint', models.CharField(blank=True, max_length=255, verbose_name='Endpoint')),
                ('method', models.CharField(blank=True, max_length=10, verbose_name='Método HTTP')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Data/hora')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='audit_logs', to=settings.AUTH_USER_MODEL, verbose_name='Usuário')),
            ],
            options={
                'verbose_name': 'Log de Auditoria',
                'verbose_name_plural': 'Logs de Auditoria',
                'ordering': ['-created_at'],
            },
        ),
    ]
