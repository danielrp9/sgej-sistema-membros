from rest_framework import serializers
from .models import Certificate


class CertificateSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    member_name = serializers.CharField(source="member.name", read_only=True)
    member_registration = serializers.CharField(source="member.registration", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "id",
            "member",
            "member_name",
            "member_registration",
            "title",
            "description",
            "issue_date",
            "is_approved",
            "status",
            "status_display",
            "approved_by",
            "approved_by_name",
            "approved_at",
            "rejection_reason",
            "auth_hash",
            "auth_uuid",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id", "is_approved", "status", "approved_by",
            "approved_at", "auth_hash", "auth_uuid",
            "created_at", "updated_at",
        ]


class CertificateCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = ["member", "title", "description"]


class CertificateApprovalSerializer(serializers.Serializer):
    """Usado para aprovar ou rejeitar um certificado."""
    action = serializers.ChoiceField(choices=["approve", "reject"])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs["action"] == "reject" and not attrs.get("rejection_reason"):
            raise serializers.ValidationError(
                {"rejection_reason": "Informe o motivo da rejeição."}
            )
        return attrs


class CertificatePublicSerializer(serializers.ModelSerializer):
    """
    Serializer público para verificação de autenticidade.
    Entrega os dados formatados do certificado via hash.
    """
    member_name = serializers.CharField(source="member.name", read_only=True)
    member_registration = serializers.CharField(source="member.registration", read_only=True)
    member_email = serializers.CharField(source="member.email", read_only=True)
    approved_by_name = serializers.CharField(source="approved_by.get_full_name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Certificate
        fields = [
            "auth_hash",
            "auth_uuid",
            "title",
            "description",
            "issue_date",
            "is_approved",
            "status_display",
            "member_name",
            "member_registration",
            "member_email",
            "approved_by_name",
            "approved_at",
        ]