from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DEFAULT_DB_PATH = BASE_DIR / "app.db"

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
API_TITLE = os.getenv("API_TITLE", "FastAPI SQLite Project")
API_VERSION = os.getenv("API_VERSION", "1.0.0")
