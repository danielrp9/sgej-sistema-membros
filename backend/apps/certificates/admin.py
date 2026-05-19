from django.contrib import admin
from .models import Certificate
@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
   
    list_display = (
        "title",
        "member",
        "status",
        "has_president_signature",
        "has_director_signature",
        "has_orientador_signature",
        "is_approved",
        "issue_date",
    )
  
    list_filter = (
        "status",
        "is_approved",
        "issue_date",
        "created_at",
    )
    

    search_fields = (
        "title",
        "member__name",
        "member__registration",
        "auth_hash",
        "auth_uuid",
    )
    
 
    readonly_fields = (
        "auth_hash",
        "auth_uuid",
        "signed_at_president",
        "signed_at_director",
        "signed_at_orientador",
        "created_at",
        "updated_at",
    )


    fieldsets = (
        ("Informações Gerais", {
            "fields": ("title", "member", "description", "status", "is_approved", "issue_date")
        }),
        ("Fluxo de Assinaturas Corporativas (NextStep)", {
            "fields": (
                ("signed_by_president", "signed_at_president"),
                ("signed_by_director", "signed_at_director"),
            )
        }),
        ("Fluxo de Assinatura Institucional (UFVJM)", {
            "fields": (
                ("signed_by_orientador", "signed_at_orientador"),
            )
        }),
        ("Segurança Criptográfica (Imutável)", {
            "fields": ("auth_uuid", "auth_hash", "rejection_reason"),
            "classes": ("collapse",),
        }),
    )


    @admin.display(boolean=True, description="Pres.")
    def has_president_signature(self, obj):
        return obj.signed_by_president is not None

    @admin.display(boolean=True, description="Dir.")
    def has_director_signature(self, obj):
        return obj.signed_by_director is not None

    @admin.display(boolean=True, description="Orient.")
    def has_orientador_signature(self, obj):
        return obj.signed_by_orientador is not None