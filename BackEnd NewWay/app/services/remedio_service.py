from app.db.models.remedio_model import Remedio
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.fastapi.schemas.remedio_schema import RemedioCreate, RemedioUpdate

class RemedioService:
    @staticmethod
    def criar(db: Session, request: RemedioCreate):
        remedio = Remedio(
            nome_remedio=request.nome_remedio,
            dosagem=request.dosagem,
            horario=request.horario,
            idoso_id=request.idoso_id
        )
        db.add(remedio)
        db.commit()
        db.refresh(remedio)

        return remedio
    
    @staticmethod
    def listar(db: Session):
        stmt = select(Remedio)
        return db.scalars(stmt).all()

    @staticmethod
    def buscar_por_id(db:Session, id_remedio: int):
        return db.get(Remedio, id_remedio)

    @staticmethod
    def atualizar(db: Session, id_remedio: int, request: RemedioUpdate):
        remedio = db.get(Remedio, id_remedio)

        remedio.nome_remedio = request.nome_remedio
        remedio.dosagem = request.dosagem
        remedio.horario = request.horario

        db.commit()
        db.refresh(remedio)

        return remedio
        
    @staticmethod
    def deletar(db: Session, id_remedio: int):
        remedio = db.get(Remedio, id_remedio)

        if not remedio:
            raise IndexError("O remedio informado não existe.")
        else:
            db.delete(remedio)
            db.commit()

        return f"remedio {id_remedio} excluido com sucesso!"
    
    