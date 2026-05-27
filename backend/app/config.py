from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
_ENV_FILE = _BACKEND_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    jwt_secret: str = "astronext-dev-secret-change-in-production"
    database_url: str = "sqlite:///./astronext.db"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7

    # DB lifecycle controls: safe defaults for production.
    seed_demo_data: bool = True
    allow_destructive_schema_reset: bool = False

    payu_merchant_key: str = ""
    payu_salt: str = ""
    payu_base_url: str = "https://test.payu.in/_payment"
    payu_success_url: str = "http://localhost:8000/api/v1/payments/payu/return"
    payu_failure_url: str = "http://localhost:8000/api/v1/payments/payu/return"
    frontend_base_url: str = "http://localhost:3000"
    payu_rsa_private_key: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
