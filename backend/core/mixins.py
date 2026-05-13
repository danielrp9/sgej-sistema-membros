from core.models import AuditLog


def get_client_ip(request):
    """Extrai o IP real do cliente considerando proxies."""
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def get_object_changes(old_obj, new_obj, fields):
    changes = {}
    for field in fields:
        old_val = old_obj.get(field)
        new_val = new_obj.get(field)
        if old_val != new_val:
            changes[field] = {"de": old_val, "para": new_val}
    return changes


class AuditLogMixin:
    audit_model_name = ""

    def _log(self, request, action, obj=None, changes=None):
        try:
            user = request.user if request.user.is_authenticated else None
            AuditLog.objects.create(
                user=user,
                user_email=getattr(user, "email", "anônimo"),
                user_role=getattr(user, "role", ""),
                action=action,
                model_name=self.audit_model_name,
                object_id=str(obj.pk) if obj else "",
                object_repr=str(obj) if obj else "",
                changes=changes or {},
                ip_address=get_client_ip(request),
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
                endpoint=request.path,
                method=request.method,
            )
        except Exception as e:
            pass

    def perform_create(self, serializer):
        instance = serializer.save()
        self._log(self.request, AuditLog.Action.CREATE, obj=instance)

    def perform_update(self, serializer):
        old_data = {}
        if serializer.instance:
            old_data = {
                field: str(getattr(serializer.instance, field, ""))
                for field in serializer.validated_data.keys()
            }

        instance = serializer.save()

        new_data = {
            field: str(getattr(instance, field, ""))
            for field in serializer.validated_data.keys()
        }
        changes = get_object_changes(old_data, new_data, list(old_data.keys()))
        self._log(self.request, AuditLog.Action.UPDATE, obj=instance, changes=changes)

    def perform_destroy(self, instance):
        self._log(self.request, AuditLog.Action.DELETE, obj=instance)
        instance.delete()