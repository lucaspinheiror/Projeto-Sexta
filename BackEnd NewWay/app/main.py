from fastapi import FastAPI

from database import engine
from app.db.base import Base
from app.controllers.idoso_controller import router as idoso_router
from app.controllers.parente_controller import router as parente_router
from app.controllers.remedio_controller import router as remedio_router
from app.controllers.consulta_controller import router as consulta_router

# Cria as tabelas no banco caso não existam
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Minha API",
    description="API desenvolvida com FastAPI e SQLite",
    version="1.0.0"
)

# Registra os routers
app.include_router(idoso_router)
app.include_router(parente_router)
app.include_router(remedio_router)
app.include_router(consulta_router)

@app.get("/")
def root():
    return {
        "mensagem": "API funcionando!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "online"
    }
