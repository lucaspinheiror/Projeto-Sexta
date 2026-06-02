from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    except ConnectionError as e:
        print(e)
    finally:
        db.close()    