from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from app.db.base import Base


class Idoso(Base):
    __tablename__ = "idosos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(200), nullable=False)
    idade = Column(Integer, nullable=True)
    altura = Column(Float, nullable=True)
    peso = Column(Float, nullable=True)
    senha = Column(String(100), nullable=False)

    parentes = relationship(
        "Parente",
        back_populates="idoso",
        cascade="all, delete-orphan",
    )
    remedios = relationship(
        "Remedio",
        back_populates="idoso",
        cascade="all, delete-orphan",
    )
    consultas = relationship(
        "Consulta",
        back_populates="idoso",
        cascade="all, delete-orphan",
    )
