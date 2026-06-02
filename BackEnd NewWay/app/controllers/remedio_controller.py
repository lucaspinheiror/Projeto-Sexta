from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.db.models.remedio_model import Remedio
from app.fastapi.schemas.remedio_schema import RemedioCreate, RemedioUpdate
from app.services.remedio_service import RemedioService

router = APIRouter(prefix="/remedio")

@router.post("/criar")
def criar_remedio(request: RemedioCreate, db: Session = Depends(get_db)):
    return RemedioService.criar(
        db=db,
        request=request
    )

@router.get("/listar")
def listar_remedios(
    db: Session = Depends(get_db)
):
    return RemedioService.listar(db=db)

@router.get("/listar/{id}")
def listar_remedio_por_id(
    id: int,
    db: Session = Depends(get_db),
):
    return RemedioService.buscar_por_id(db=db, id_remedio=id)

@router.put("/editar/{id}")
def editar_remedio(
    id: int,
    request: RemedioUpdate,
    db: Session = Depends(get_db),
):
    return RemedioService.atualizar(
        db=db, id_remedio=id, request=request
    )

@router.delete("/deletar/{id}")
def excluir_remedio(id: int, db: Session = Depends(get_db)):
    return RemedioService.deletar(db, id)