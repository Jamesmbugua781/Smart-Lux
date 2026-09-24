from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8', case_sensitive=False)

    APP_NAME: str = 'Smart Campus Assistant'
    APP_VERSION: str = '0.1.0'
    DATABASE_URL: str = 'sqlite:///./smart_campus.db'
    AI_API_KEY: str = ''
    AI_MODEL: str = 'gemini-2.5-flash'
    CORS_ORIGINS: list[str] = ['http://localhost:5173']


settings = Settings()
