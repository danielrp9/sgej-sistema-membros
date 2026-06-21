from django.contrib import admin
from .models import Member, Sanction


class SanctionInline(admin.TabularInline):
    model = Sanction
    extra = 1


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "registration", "status", "entry_date", "exit_date"]
    list_filter = ["status"]
    search_fields = ["name", "email", "registration"]
    ordering = ["name"]
    date_hierarchy = "entry_date"
    inlines = [SanctionInline]


@admin.register(Sanction)
class SanctionAdmin(admin.ModelAdmin):
    list_display = ["member", "description", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["member__name", "description"]