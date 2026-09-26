from pydantic_settings import BaseSettings, SettingsConfigDict


import secrets


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    APP_NAME: str = 'Smart Lux'
    APP_VERSION: str = '0.1.0'
    APP_ENV: str = 'development'  # 'development' | 'production'
    DATABASE_URL: str = 'postgresql://daxit@/smart_campus_db'

    # JWT Secret – MUST be set via environment variable in production.
    # A random fallback is generated per-process for local dev only.
    SECRET_KEY: str = secrets.token_hex(32)

    # AI Provider Selection: 'gemini' or 'grok'
    AI_PROVIDER: str = 'gemini'

    # Gemini API Configuration
    GEMINI_API_KEY: str = ''
    AI_API_KEY: str = ''  # Fallback/alias for GEMINI_API_KEY
    AI_MODEL: str = 'gemini-2.5-flash'

    # Grok (xAI) API Configuration
    GROK_API_KEY: str = ''
    GROK_MODEL: str = 'llama-3.3-70b-versatile'
    GROK_BASE_URL: str = 'https://api.groq.com/openai/v1'

    CORS_ORIGINS: list[str] = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
    ]

    # Rate limiting (slowapi format: "N/period")
    RATE_LIMIT: str = '60/minute'
    AUTH_RATE_LIMIT: str = '5/minute'

    # Maximum file upload size in bytes (default: 5 MB)
    MAX_UPLOAD_BYTES: int = 5 * 1024 * 1024

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() == 'production'

    @property
    def effective_gemini_api_key(self) -> str:
        return self.GEMINI_API_KEY or self.AI_API_KEY


settings = Settings()

