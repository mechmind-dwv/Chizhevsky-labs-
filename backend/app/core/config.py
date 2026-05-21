from pydantic_settings import BaseSettings
from typing import List
import json

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://chizhevsky_admin:cosmic_radiation_secret_2026@localhost:5432/chizhevsky_intelligence"
    DATABASE_URL_SYNC: str = "postgresql://chizhevsky_admin:cosmic_radiation_secret_2026@localhost:5432/chizhevsky_intelligence"
    NOAA_SWPC_URL: str = "https://services.swpc.noaa.gov/json/"
    CORS_ORIGINS: str = '["http://localhost:5173","http://localhost:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    class Config:
        env_file = ".env"

settings = Settings()
