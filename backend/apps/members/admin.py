from django.contrib import admin
from .models import Member


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ["name", "email", "registration", "status", "entry_date", "exit_date"]
    list_filter = ["status"]
    search_fields = ["name", "email", "registration"]
    ordering = ["name"]
    date_hierarchy = "entry_date"