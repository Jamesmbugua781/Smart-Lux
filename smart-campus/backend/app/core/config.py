from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    APP_NAME: str = 'Smart Lux'
    APP_VERSION: str = '0.1.0'
    DATABASE_URL: str = 'postgresql://postgres:postgres@localhost:5432/smart_campus'

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
    # Brute-force / rate-limit (slowapi format: "N/period")
    RATE_LIMIT: str = '10/minute'

    @property
    def effective_gemini_api_key(self) -> str:
        return self.GEMINI_API_KEY or self.AI_API_KEY


settings = Settings()

