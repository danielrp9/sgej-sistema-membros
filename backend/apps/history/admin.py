from django.contrib import admin
from .models import MemberHistory


@admin.register(MemberHistory)
class MemberHistoryAdmin(admin.ModelAdmin):
    list_display = ["member", "reason", "entry_date", "exit_date", "created_at"]
    list_filter = ["reason"]
    search_fields = ["member__name", "member__registration"]
    ordering = ["-entry_date"]
    readonly_fields = ["created_at"]