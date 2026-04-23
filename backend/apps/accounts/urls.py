from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    CustomTokenObtainPairView,
    MeView,
    UserDetailView,
    UserListCreateView,
)

urlpatterns = [
    # ── Autenticação ──────────────────────────────────────────────────────────
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # ── Usuário autenticado ───────────────────────────────────────────────────
    path("auth/me/", MeView.as_view(), name="me"),
    path("auth/change-password/", ChangePasswordView.as_view(), name="change_password"),

    # ── Gerenciamento de usuários (ADMIN) ─────────────────────────────────────
    path("users/", UserListCreateView.as_view(), name="user_list_create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
]