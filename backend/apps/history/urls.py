from django.urls import path
from .views import MemberHistoryListView, MemberHistorySummaryView

urlpatterns = [
    path("<int:pk>/history/", MemberHistoryListView.as_view(), name="member_history"),
    path("<int:pk>/history/summary/", MemberHistorySummaryView.as_view(), name="member_history_summary"),
]