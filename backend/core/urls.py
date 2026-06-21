import os
from django.contrib import admin
from django.conf import settings
from django.urls import path, include, re_path
from django.views.generic import TemplateView, RedirectView
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from core.audit_views import AuditLogListView, AuditLogStatsView
from certificates.views import CertificateVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    re_path(
        r'^api/v1/public/verify/(?P<auth_hash>[\w-]+)/?$', 
        CertificateVerifyView.as_view(), 
        name='certificate-public-verify'
    ),

    # Módulos de API do Ecossistema SGEJ
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/members/', include('members.urls')),
    path('api/v1/history/', include('history.urls')),
    path('api/v1/certificates/', include('certificates.urls')),
    path('api/v1/audit/', AuditLogListView.as_view(), name='audit_list'),
    path('api/v1/audit/stats/', AuditLogStatsView.as_view(), name='audit_stats'),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Verifica se o frontend está compilado localmente
FRONTEND_DIR = settings.BASE_DIR.parent / 'frontend' / 'dist'
if os.path.exists(FRONTEND_DIR / 'index.html'):
    urlpatterns += [
        re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='index'),
    ]
else:
    # Se o frontend não estiver aqui (deploy híbrido), redireciona a raiz para o admin
    urlpatterns += [
        path('', RedirectView.as_view(url='/admin/', permanent=False)),
    ]