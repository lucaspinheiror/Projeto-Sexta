from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models.parente_model import Parente, ParentescoEnum
from app.fastapi.schemas.parente_schema import ParenteCreate, ParenteUpdate

class ParenteService:
    @staticmethod
    def criar(db:Session, request: ParenteCreate):
        parente = Parente(nome = request.nome, idade=request.idade, parentesco = request.parentesco, telefone = request.telefone, idoso_id = request.idoso_id)
        print(parente)
        db.add(parente)
        db.commit()
        db.refresh(parente)

        return parente
    
    @staticmethod
    def listar(db: Session):
        stmt = select(Parente)
        return db.scalars(stmt).all()

    @staticmethod
    def buscar_por_id(db:Session, id_parente: int):
        return db.get(Parente, id_parente)

    @staticmethod
    def atualizar(db: Session, id_parente: int, request: ParenteUpdate):
        parente = db.get(Parente, id_parente)

        
        parente.nome = request.nome
        parente.idade = request.idade 
        parente.parentesco = request.parentesco
        parente.telefone = request.telefone

        db.commit()
        db.refresh(parente)

        return parente

    @staticmethod
    def deletar(db: Session, id_parente: int):
        parente = db.get(Parente, id_parente)

        if not parente:
            raise IndexError("O parente informado não existe.")
        else:
            db.delete(parente)
            db.commit()

        return f"parente {id_parente} excluido com sucesso!"