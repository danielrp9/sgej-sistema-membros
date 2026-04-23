from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAdmin(BasePermission):
    """
    Permite acesso apenas a usuários com role ADMIN (Diretoria).
    """
    message = "Acesso restrito à Diretoria (ADMIN)."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "ADMIN"
        )


class IsViewer(BasePermission):
    """
    Permite acesso a usuários com role VIEWER (Orientadora).
    """
    message = "Acesso restrito à Orientadora (VIEWER)."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "VIEWER"
        )


class IsAdminOrViewer(BasePermission):
    """
    Permite acesso a qualquer usuário autenticado (ADMIN ou VIEWER).
    Equivale a IsAuthenticated, mas documenta a intenção.
    """
    message = "Autenticação necessária."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated


class IsAdminOrReadOnly(BasePermission):
    """
    ADMIN pode ler e escrever.
    VIEWER pode apenas ler (métodos seguros: GET, HEAD, OPTIONS).
    """
    SAFE_METHODS = ("GET", "HEAD", "OPTIONS")
    message = "Apenas a Diretoria pode realizar esta ação."

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in self.SAFE_METHODS:
            return True
        return request.user.role == "ADMIN"