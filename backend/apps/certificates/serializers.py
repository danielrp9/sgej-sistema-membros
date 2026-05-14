from rest_framework import serializers
from .models import Certificate
from datetime import date

class CertificateSerializer(serializers.ModelSerializer):
    """
    Serializer principal com cálculo dinâmico de horas (Protocolo 6h/semana).
    """
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)
    created_by_name = serializers.CharField(source="created_by.get_full_name", read_only=True)
    member = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            "id", "member", "title", "description", "issue_date",
            "is_approved", "status", "status_display", "approved_by",
            "approved_by_name", "approved_at", "rejection_reason",
            "auth_hash", "auth_uuid", "created_at", "updated_at",
            "created_by_name",
        ]
        read_only_fields = fields

    def get_member(self, obj):
        member = obj.member
        
        start_date = member.created_at.date() if member.created_at else date.today()
        end_date = obj.approved_at.date() if obj.approved_at else date.today()
        
        weeks = max(1, (end_date - start_date).days // 7)
        total_hours = weeks * 6 

        return {
            "id": member.id,
            "name": member.name,
            "registration": member.registration,
            "cpf": getattr(member, 'cpf', 'xxx.xxx.xxx-xx'),
            "role": getattr(member, 'role', 'Colaborador(a)'),
            "department": getattr(member, 'department', 'Operacional'),
            "start_date": start_date.strftime('%d/%m/%Y'),
            "calculated_hours": total_hours,
        }

class CertificateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["member", "title", "description"]

class CertificateApprovalSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=["approve", "reject"])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs["action"] == "reject" and not attrs.get("rejection_reason"):
            raise serializers.ValidationError({"rejection_reason": "Informe o motivo."})
        return attrs

class CertificatePublicSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.name", read_only=True)
    member_registration = serializers.CharField(source="member.registration", read_only=True)
    member_email = serializers.CharField(source="member.email", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "auth_hash", "auth_uuid", "title", "description", "issue_date",
            "is_approved", "status_display", "member_name", "member_registration",
            "member_email", "approved_by_name", "approved_at",
        ]