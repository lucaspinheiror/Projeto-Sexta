from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.db.models.idoso_model import Idoso
from app.fastapi.schemas.idoso_schema import IdosoCreate, IdosoUpdate, IdosoLogin
from app.services.idoso_service import IdosoService


router = APIRouter(prefix="/idoso")

service = IdosoService()

@router.post("/criar")
def criar_idoso(request: IdosoCreate, db: Session = Depends(get_db)):
    return service.criar(
        db=db,
        request=request
    )

@router.get("/listar")
def listar_idosos(
    db: Session = Depends(get_db)
):
    return IdosoService.listar(db=db)

@router.get("/listar/{id}")
def listar_idoso_por_id(
    id: int,
    db: Session = Depends(get_db),
):
    return IdosoService.buscar_por_id(db=db, id_idoso=id)

@router.put("/editar/{id}")
def editar_idoso(
    id: int,
    request: IdosoUpdate,
    db: Session = Depends(get_db),
):
    idoso = IdosoService.atualizar(
        db=db, id_idoso=id, request=request
    )

    if not idoso:
        raise HTTPException(status_code=404, detail="Idoso não encontado")
    else:
        return idoso
    

@router.delete("/deletar/{id}")
def excluir_idoso(id: int, db: Session = Depends(get_db)):
    return IdosoService.deletar(db, id)

@router.post("/login")
def login_idoso(request: IdosoLogin, db: Session = Depends(get_db)):
    idoso = IdosoService.login(db=db, request=request)

    if not idoso:
        raise HTTPException(status_code=401, detail="Nome ou senha inválidos")

    return {"mensagem": "Login realizado com sucesso!", "id": idoso.id, "nome": idoso.nome}

@router.get("/buscarnome")
def buscar_idoso_por_nome(nome: str, db: Session = Depends(get_db)):
    idoso = IdosoService.buscar_por_nome(db=db, nome=nome)

    if not idoso:
        raise HTTPException(status_code=404, detail="Idoso não encontrado")

    return {"id": idoso.id, "nome": idoso.nome}