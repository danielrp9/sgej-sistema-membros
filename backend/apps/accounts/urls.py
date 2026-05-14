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
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="me"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),

    path("users/", UserListCreateView.as_view(), name="user_list_create"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
]