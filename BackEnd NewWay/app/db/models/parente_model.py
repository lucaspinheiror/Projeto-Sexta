from enum import Enum
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import relationship

from app.db.base import Base


class ParentescoEnum(str, Enum):
    neto = "neto"
    neta = "neta"
    filho = "filho"
    irmao = "irmao"
    outro = "outro"


class Parente(Base):
    __tablename__ = "parentes"

    id = Column(Integer, primary_key=True, index=True)
    idoso_id = Column(Integer, ForeignKey("idosos.id", ondelete="CASCADE"), nullable=False, index=True)
    nome = Column(String(200), nullable=False)
    idade = Column(Integer, nullable=True)
    parentesco = Column(SAEnum(ParentescoEnum, native_enum=False), nullable=False)
    telefone = Column(String(50), nullable=True)

    idoso = relationship("Idoso", back_populates="parentes")
