from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Documentação Automática (Swagger)
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # Rotas dos Módulos
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/members/', include('members.urls')),
    path('api/v1/history/', include('history.urls')),
    path('api/v1/certificates/', include('certificates.urls')),

    path("api/", include("apps.accounts.urls")),

]