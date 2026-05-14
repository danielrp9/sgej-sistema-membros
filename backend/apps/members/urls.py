from django.urls import path
from .views import (
    MemberListCreateView, 
    MemberDetailView, 
    MemberStatsView, 
    MemberTerminateView,
    MemberHistoryView  # Certifique-se de que esta View existe no seu views.py
)

urlpatterns = [
    path("", MemberListCreateView.as_view(), name="member_list_create"),
    
    path("stats/", MemberStatsView.as_view(), name="member_stats"),
    
    path("<int:pk>/", MemberDetailView.as_view(), name="member_detail"),
    
    path("<int:pk>/history/", MemberHistoryView.as_view(), name="member_history"),
    
    path("<int:pk>/terminate/", MemberTerminateView.as_view(), name="member_terminate"),
]