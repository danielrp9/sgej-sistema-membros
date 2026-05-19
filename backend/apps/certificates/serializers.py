from rest_framework import serializers
from .models import Certificate
from datetime import date

class CertificateSerializer(serializers.ModelSerializer):
    """
    Serializer principal com suporte ao fluxo de 3 assinaturas cumulativas.
    """
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    
    president_name = serializers.CharField(source="signed_by_president.get_full_name", read_only=True)
    director_name = serializers.CharField(source="signed_by_director.get_full_name", read_only=True)
    orientador_name = serializers.CharField(source="signed_by_orientador.get_full_name", read_only=True)
    
    member = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = [
            "id", "member", "title", "description", "issue_date",
            "is_approved", "status", "status_display", "rejection_reason",
            "auth_hash", "auth_uuid", "created_at", "updated_at",
            "signed_by_president", "signed_at_president", "president_name",
            "signed_by_director", "signed_at_director", "director_name",
            "signed_by_orientador", "signed_at_orientador", "orientador_name",
        ]
        read_only_fields = fields

    def get_member(self, obj):
        member = obj.member
        
        start_date = member.created_at.date() if member.created_at else date.today()
        end_date = obj.issue_date if obj.is_approved and obj.issue_date else date.today()
        
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
    role = serializers.ChoiceField(choices=["president", "director", "orientador"], required=False)
    action = serializers.ChoiceField(choices=["approve", "reject"], default="approve")
    reason = serializers.CharField(required=False, allow_blank=True, default="")

    def validate(self, attrs):
        if attrs["action"] == "reject" and not attrs.get("reason"):
            raise serializers.ValidationError({"reason": "Informe o motivo da rejeição."})
        return attrs

class CertificatePublicSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source="member.name", read_only=True)
    member_registration = serializers.CharField(source="member.registration", read_only=True)
    member_email = serializers.CharField(source="member.email", read_only=True)
    
    president_name = serializers.CharField(source="signed_by_president.get_full_name", read_only=True)
    director_name = serializers.CharField(source="signed_by_director.get_full_name", read_only=True)
    orientador_name = serializers.CharField(source="signed_by_orientador.get_full_name", read_only=True)
    
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "auth_hash", "auth_uuid", "title", "description", "issue_date",
            "is_approved", "status_display", "member_name", "member_registration",
            "member_email", "president_name", "director_name", "orientador_name",
        ]