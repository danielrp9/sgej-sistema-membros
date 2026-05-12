from django.apps import AppConfig


class HistoryConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "history"
    verbose_name = "Histórico"

    def ready(self):
        import history.signals  # noqa — carrega os signals ao iniciar o app