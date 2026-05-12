from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ["title", "member", "status", "is_approved", "issue_date", "approved_by", "created_at"]
    list_filter = ["status", "is_approved"]
    search_fields = ["title", "member__name", "member__registration", "auth_hash"]
    readonly_fields = ["auth_hash", "auth_uuid", "is_approved", "approved_at", "created_at", "updated_at"]
    ordering = ["-created_at"]