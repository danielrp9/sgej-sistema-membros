from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from core.audit_views import AuditLogListView, AuditLogStatsView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Documentação
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Módulos
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/members/', include('members.urls')),
    path('api/v1/members/', include('history.urls')),
    path('api/v1/certificates/', include('certificates.urls')),

    # Auditoria (apenas ADMIN)
    path('api/v1/audit/', AuditLogListView.as_view(), name='audit_list'),
    path('api/v1/audit/stats/', AuditLogStatsView.as_view(), name='audit_stats'),
]