from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView

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
    Retorna access token, refresh token e dados organizacionais do usuário.
    """
    serializer_class = CustomTokenObtainPairSerializer


class MeView(APIView):
    """Retorna os dados do usuário autenticado no ecossistema."""
    permission_classes = [IsAdminOrViewer]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class ChangePasswordView(APIView):
    """Alteração de senha segura de autoatendimento."""
    permission_classes = [IsAdminOrViewer]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Senha alterada com sucesso."}, status=status.HTTP_200_OK)


class UserListCreateView(generics.ListCreateAPIView):
    """
    GET  → Lista todos os usuários cadastrados (ADMIN).
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
    GET    → Detalha usuário corporativo (ADMIN).
    PATCH  → Atualiza dados cadastrais ou permissões (ADMIN).
    DELETE → Desativa/Remove usuário (ADMIN).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]