from rest_framework import serializers
from .models import Member, Sanction


class SanctionSerializer(serializers.ModelSerializer):
    created_at_display = serializers.SerializerMethodField()

    class Meta:
        model = Sanction
        fields = ["id", "description", "created_at", "created_at_display"]
        read_only_fields = ["id", "created_at", "created_at_display"]

    def get_created_at_display(self, obj):
        return obj.created_at.strftime("%d/%m/%Y %H:%M")


class MemberSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    sanctions = SanctionSerializer(many=True, read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "name", "email", "cpf", "registration", 
            "course", "role", "department", "entry_date", 
            "exit_date", "status", "status_display", "suspension_reason",
            "sanctions", "created_at", "updated_at"
        ]

        read_only_fields = ["id", "created_at", "updated_at"]


    def validate(self, attrs):
        entry_date = attrs.get("entry_date")
        exit_date = attrs.get("exit_date")
        if entry_date and exit_date and exit_date < entry_date:
            raise serializers.ValidationError(
                {"exit_date": "A data de saída não pode ser anterior à data de entrada."}
            )
        return attrs

class MemberListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Member
        fields = [
            "id", "name", "email", "registration", "status", 
            "status_display", "entry_date", "exit_date", "role", 
            "department", "suspension_reason"
        ]