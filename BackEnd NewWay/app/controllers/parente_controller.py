from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.db.models.parente_model import Parente
from app.fastapi.schemas.parente_schema import ParenteCreate, ParenteUpdate
from app.services.parente_service import ParenteService


router = APIRouter(prefix="/parente")

@router.post("/criar")
def criar_parente(request: ParenteCreate, db: Session = Depends(get_db)):
    return ParenteService.criar(
        db=db,
        request = request
    )

@router.get("/listar")
def listar_parentes(
    db: Session = Depends(get_db)
):
    return ParenteService.listar(db=db)

@router.get("/listar/{id}")
def listar_parente_por_id(
    id: int,
    db: Session = Depends(get_db),
):
    return ParenteService.buscar_por_id(db=db, id_parente=id)

@router.put("/editar/{id}")
def editar_parente(
    id: int,
    request: ParenteUpdate,
    db: Session = Depends(get_db),
):
    parente = ParenteService.atualizar(
        db=db, id_parente=id, request=request
    )
    return parente

    

@router.delete("/deletar/{id}")
def excluir_parente(id: int, db: Session = Depends(get_db)):
    return ParenteService.deletar(db, id)