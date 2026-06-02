from app.db.models.consulta_model import Consulta
from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import datetime
from app.fastapi.schemas.consulta_schema import ConsultaCreate
from app.fastapi.schemas.consulta_schema import ConsultaUpdate

class ConsultaService:

    @staticmethod
    def criar(db: Session, request: ConsultaCreate):
        nova_consulta = Consulta(
            data_consulta=request.data_consulta,
            nome_medico=request.nome_medico,
            observacao=request.observacao,
            local=request.local,
            idoso_id=request.idoso_id
        )

        db.add(nova_consulta)
        db.commit()
        db.refresh(nova_consulta)

        return nova_consulta
    
    @staticmethod
    def listar(db: Session):
        stmt = select(Consulta)
        return db.scalars(stmt).all()

    @staticmethod
    def buscar_por_id(db:Session, id_consulta: int):
        return db.get(Consulta, id_consulta)
    
    @staticmethod
    def atualizar(db: Session, id_consulta: int, request: ConsultaUpdate):
        consulta = db.get(Consulta, id_consulta)

        
        consulta.data_consulta = request.data_consulta
        consulta.nome_medico = request.nome_medico
        consulta.observacao = request.observacao
        consulta.local = request.local
        consulta.idoso_id = request.idoso_id

        db.commit()
        db.refresh(consulta)

        return consulta
    
    @staticmethod
    def deletar(db: Session, id_consulta: int):
        consulta = db.get(Consulta, id_consulta)

        if not consulta:
            raise IndexError("A consulta informada não existe.")
        else:
            db.delete(consulta)
            db.commit()

        return f"consulta {id_consulta} excluida com sucesso!"
    
    