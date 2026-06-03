from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.models.idoso_model import Idoso
from app.fastapi.schemas.idoso_schema import IdosoCreate, IdosoUpdate, IdosoLogin

class IdosoService:
    @staticmethod
    def criar(db:Session, request: IdosoCreate):
        idoso = Idoso(nome = request.nome, idade = request.idade, altura = request.altura, peso = request.peso, senha = request.senha)

        db.add(idoso)
        db.commit()
        db.refresh(idoso)

        return idoso
    
    @staticmethod
    def listar(db: Session):
        stmt = select(Idoso)
        return db.scalars(stmt).all()
    
    @staticmethod
    def buscar_por_id(db:Session, id_idoso: int):
        return db.get(Idoso, id_idoso)
    
    @staticmethod
    def atualizar(db: Session, id_idoso: int, request: IdosoUpdate):
        idoso = db.get(Idoso, id_idoso)

        
        idoso.nome = request.nome
        idoso.idade = request.idade 
        idoso.altura = request.altura
        idoso.peso = request.peso

        db.commit()
        db.refresh(idoso)

        return idoso

    @staticmethod
    def deletar(db: Session, id_idoso: int):
        idoso = db.get(Idoso, id_idoso)

        if not idoso:
            raise IndexError("O idoso informado não existe.")
        else:
            db.delete(idoso)
            db.commit()

        return f"idoso {id_idoso} excluido com sucesso!"

    @staticmethod
    def login(db: Session, request: IdosoLogin):
        stmt = select(Idoso).where(Idoso.nome == request.nome)
        idoso = db.scalars(stmt).first()

        if not idoso or idoso.senha != request.senha:
            return None

        return idoso

    @staticmethod
    def buscar_por_nome(db: Session, nome: str):
        stmt = select(Idoso).where(Idoso.nome == nome)
        idoso = db.scalars(stmt).first()
        return idoso