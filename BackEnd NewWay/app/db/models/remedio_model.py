from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class Remedio(Base):
    __tablename__ = "remedios"

    id = Column(Integer, primary_key=True, index=True)
    idoso_id = Column(Integer, ForeignKey("idosos.id", ondelete="CASCADE"), nullable=False, index=True)
    nome_remedio = Column(String(250), nullable=False)
    dosagem = Column(String(100), nullable=True)
    horario = Column(String(100), nullable=True)

    idoso = relationship("Idoso", back_populates="remedios")
