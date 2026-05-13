from rest_framework.response import Response
from rest_framework.views import exception_handler
from rest_framework import status
from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)


# ── Handlers globais Django (para DEBUG=False) ────────────────────────────────

def handler_404(request, exception=None):
    """Handler global para rotas não encontradas."""
    return JsonResponse(
        {
            "error": "not_found",
            "detail": "O recurso solicitado não foi encontrado.",
            "path": request.path,
        },
        status=404,
    )


def handler_500(request):
    """Handler global para erros internos do servidor."""
    logger.error(f"Erro 500 em: {request.path} | Método: {request.method}")
    return JsonResponse(
        {
            "error": "server_error",
            "detail": "Erro interno do servidor. Tente novamente mais tarde.",
        },
        status=500,
    )


# ── Handler customizado do DRF ────────────────────────────────────────────────

def custom_exception_handler(exc, context):
    """
    Intercepta todas as exceções do DRF e padroniza o formato de resposta.
    Configurado em settings.py → REST_FRAMEWORK['EXCEPTION_HANDLER'].
    """
    response = exception_handler(exc, context)

    request = context.get("request")
    view = context.get("view")

    if response is not None:
        error_code = _get_error_code(response.status_code)

        # Normaliza o campo 'detail' para sempre ser string
        detail = response.data
        if isinstance(detail, dict) and "detail" in detail:
            detail = str(detail["detail"])
        elif isinstance(detail, list):
            detail = detail[0] if detail else "Erro desconhecido."

        response.data = {
            "error": error_code,
            "detail": detail,
            "status_code": response.status_code,
        }

        # Loga erros 5xx
        if response.status_code >= 500:
            logger.error(
                f"[{response.status_code}] {getattr(request, 'method', '')} "
                f"{getattr(request, 'path', '')} | view={view.__class__.__name__} | {exc}"
            )

    return response


def _get_error_code(status_code):
    codes = {
        400: "bad_request",
        401: "unauthorized",
        403: "forbidden",
        404: "not_found",
        405: "method_not_allowed",
        429: "too_many_requests",
        500: "server_error",
    }
    return codes.get(status_code, "error")