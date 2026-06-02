from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.db.models.consulta_model import Consulta
from app.fastapi.schemas.consulta_schema import ConsultaCreate
from app.services.consultas_service import ConsultaService

router = APIRouter(prefix="/consulta")

@router.post("/criar")
def criar_consulta(request: ConsultaCreate, db: Session = Depends(get_db)):
    return ConsultaService.criar(
        db=db,
        request=request
    )

@router.get("/listar")
def listar_consulta(
    db: Session = Depends(get_db)
):
    return ConsultaService.listar(db=db)

@router.get("/listar/{id}")
def listar_consulta_por_id(
    id: int,
    db: Session = Depends(get_db),
):
    return ConsultaService.buscar_por_id(db=db, id_consulta=id)

@router.put("/editar/{id}")
def editar_consulta(
    id: int,
    request: ConsultaCreate,
    db: Session = Depends(get_db),
):
    return ConsultaService.atualizar(
        db=db, id_consulta=id, request=request)

@router.delete("/deletar/{id}")
def excluir_consulta(id: int, db: Session = Depends(get_db)):
    return ConsultaService.deletar(db, id)