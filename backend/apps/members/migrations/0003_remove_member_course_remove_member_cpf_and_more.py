
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0002_member_course_member_cpf_member_department_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='course',
        ),
        migrations.RemoveField(
            model_name='member',
            name='cpf',
        ),
        migrations.RemoveField(
            model_name='member',
            name='department',
        ),
        migrations.RemoveField(
            model_name='member',
            name='role',
        ),
    ]
