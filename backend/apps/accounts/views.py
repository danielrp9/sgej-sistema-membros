from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .permissions import IsAdmin, IsAdminOrViewer
from .serializers import (
    ChangePasswordSerializer,
    CreateUserSerializer,
    CustomTokenObtainPairSerializer,
    UserSerializer,
)

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Login via e-mail + senha.
    Retorna access token, refresh token e dados do usuário.
    """
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """Retorna os dados do usuário autenticado."""
    permission_classes = [IsAdminOrViewer]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """Alteração de senha do próprio usuário."""
    permission_classes = [IsAdminOrViewer]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)


# ── Gerenciamento de usuários (apenas ADMIN) ──────────────────────────────────

class UserListCreateView(generics.ListCreateAPIView):
    """
    GET  → Lista todos os usuários (ADMIN).
    POST → Cria novo usuário (ADMIN).
    """
    queryset = User.objects.all().order_by("email")
    permission_classes = [IsAdmin]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateUserSerializer
        return UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    → Detalha usuário (ADMIN).
    PATCH  → Atualiza parcialmente (ADMIN).
    DELETE → Remove usuário (ADMIN).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]