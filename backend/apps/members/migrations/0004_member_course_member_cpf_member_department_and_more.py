
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0003_remove_member_course_remove_member_cpf_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='course',
            field=models.CharField(default='Sistemas de Informação', max_length=100, verbose_name='Curso'),
        ),
        migrations.AddField(
            model_name='member',
            name='cpf',
            field=models.CharField(max_length=14, null=True, unique=True, verbose_name='CPF'),
        ),
        migrations.AddField(
            model_name='member',
            name='department',
            field=models.CharField(max_length=100, null=True, verbose_name='Departamento'),
        ),
        migrations.AddField(
            model_name='member',
            name='role',
            field=models.CharField(max_length=100, null=True, verbose_name='Cargo'),
        ),
    ]
