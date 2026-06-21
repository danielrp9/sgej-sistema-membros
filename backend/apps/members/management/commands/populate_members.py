from django.core.management.base import BaseCommand
from members.models import Member
from datetime import date
import random

class Command(BaseCommand):
    help = 'Populates the database with 24 mock members'

    def handle(self, *args, **options):
        departments = ["Projetos", "Marketing", "Recursos Humanos", "Vendas", "Presidência"]
        roles = {
            "Projetos": ["Gerente de Projetos", "Desenvolvedor Full Stack", "Designer UI/UX", "Consultor de TI"],
            "Marketing": ["Diretor de Marketing", "Assessor de Comunicação", "Social Media"],
            "Recursos Humanos": ["Diretora de RH", "Assessor de Gestão de Pessoas"],
            "Vendas": ["Gerente Comercial", "Consultor de Vendas"],
            "Presidência": ["Presidente", "Vice-Presidente"]
        }
        courses = ["Sistemas de Informação", "Ciência da Computação", "Engenharia de Software", "Administração", "Design"]
        
        first_names = ["Ana", "Bruno", "Carlos", "Diana", "Eduardo", "Fernanda", "Gabriel", "Helena", "Igor", "Julia", 
                       "Lucas", "Mariana", "Pedro", "Larissa", "Gustavo", "Camila", "Rodrigo", "Beatriz", "Thiago", 
                       "Amanda", "Felipe", "Sofia", "Mateus", "Alice", "Rafael", "Letícia"]
        last_names = ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Gomes", 
                      "Costa", "Ribeiro", "Martins", "Carvalho", "Melo", "Barbosa", "Lima", "Vieira", "Teixeira"]

        mock_data = [
            # 2025 entry (last year) - 12 members
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.INACTIVE, "exit": True},
            {"year": 2025, "status": Member.Status.INACTIVE, "exit": True},
            {"year": 2025, "status": Member.Status.INACTIVE, "exit": True},
            {"year": 2025, "status": Member.Status.SUSPENDED, "suspend": True},
            {"year": 2025, "status": Member.Status.ACTIVE},
            {"year": 2025, "status": Member.Status.ACTIVE},

            # 2026 entry (this year) - 12 members
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.SUSPENDED, "suspend": True},
            {"year": 2026, "status": Member.Status.SUSPENDED, "suspend": True},
            {"year": 2026, "status": Member.Status.INACTIVE, "exit": True},
            {"year": 2026, "status": Member.Status.ACTIVE},
            {"year": 2026, "status": Member.Status.ACTIVE},
        ]
        
        created_count = 0
        for idx, item in enumerate(mock_data):
            fname = first_names[idx % len(first_names)]
            lname = last_names[(idx + 3) % len(last_names)]
            name = f"{fname} {lname}"
            
            email = f"{fname.lower()}.{lname.lower()}{idx}@sgej.com"
            cpf = f"{random.randint(100, 999)}.{random.randint(100, 999)}.{random.randint(100, 999)}-{random.randint(10, 99)}"
            registration = f"{item['year']}0{10 + idx:02d}"
            
            dept = random.choice(departments)
            role = random.choice(roles[dept])
            course = random.choice(courses)
            
            if item['year'] == 2025:
                entry_date = date(2025, random.randint(1, 6), random.randint(1, 28))
            else:
                entry_date = date(2026, random.randint(1, 3), random.randint(1, 28))
                
            exit_date = None
            if item.get("exit"):
                exit_date = date(2026, 5, 10)
                
            suspension_reason = None
            if item.get("suspend"):
                suspension_reason = "Faltas não justificadas a reuniões gerais ordinárias."
                
            if not Member.objects.filter(email=email).exists():
                Member.objects.create(
                    name=name,
                    email=email,
                    cpf=cpf,
                    registration=registration,
                    course=course,
                    role=role,
                    department=dept,
                    entry_date=entry_date,
                    exit_date=exit_date,
                    status=item['status'],
                    suspension_reason=suspension_reason
                )
                created_count += 1
                
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {created_count} members!'))
