from django.contrib import admin
from core.models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ["created_at", "user_email", "user_role", "action", "model_name", "object_repr", "ip_address"]
    list_filter = ["action", "model_name", "user_role"]
    search_fields = ["user_email", "object_repr", "endpoint"]
    readonly_fields = ["user", "user_email", "user_role", "action", "model_name",
                       "object_id", "object_repr", "changes", "ip_address",
                       "user_agent", "endpoint", "method", "created_at"]
    ordering = ["-created_at"]

    def has_add_permission(self, request):
        return False  # logs não podem ser criados manualmente

    def has_change_permission(self, request, obj=None):
        return False  # logs não podem ser editados

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # apenas superuser pode deletar