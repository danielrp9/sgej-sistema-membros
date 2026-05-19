from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permite acesso apenas a membros da gestão interna da EJ (Presidente e RH).
    """
    message = "Acesso restrito à Diretoria (Presidente e RH)."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ["president", "director"]
        )


class IsViewer(BasePermission):
    """
    Permite acesso apenas à Coordenação/Orientadora institucional.
    """
    message = "Acesso restrito à Coordenação Acadêmica."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "orientador"
        )


class IsAdminOrViewer(BasePermission):
    """
    Permite acesso a qualquer um dos 3 papéis autenticados na Central de Assinaturas.
    """
    message = "Autenticação corporativa necessária."

    def has_permission(self, request, view):
        return (
            request.user 
            and request.user.is_authenticated
            and request.user.role in ["president", "director", "orientador"]
        )


class IsAdminOrReadOnly(BasePermission):
    """
    Gestão interna (Presidente e RH) possui privilégios de escrita.
    Coordenação possui privilégios apenas de leitura nos dados cadastrais.
    """
    SAFE_METHODS = ("GET", "HEAD", "OPTIONS")
    message = "Apenas a Diretoria da EJ pode realizar modificações."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in self.SAFE_METHODS:
            return True
        return request.user.role in ["president", "director"]