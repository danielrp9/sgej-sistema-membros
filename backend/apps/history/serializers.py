from rest_framework import serializers
from .models import MemberHistory


class MemberHistorySerializer(serializers.ModelSerializer):
    reason_display = serializers.CharField(source="get_reason_display", read_only=True)
    tempo_permanencia = serializers.SerializerMethodField()
    member_name = serializers.CharField(source="member.name", read_only=True)

    class Meta:
        model = MemberHistory
        fields = [
            "id",
            "member",
            "member_name",
            "reason",
            "reason_display",
            "entry_date",
            "exit_date",
            "tempo_permanencia",
            "notes",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_tempo_permanencia(self, obj):
        return obj.tempo_permanencia