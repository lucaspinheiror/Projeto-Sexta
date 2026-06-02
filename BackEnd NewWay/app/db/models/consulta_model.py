from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Consulta(Base):
    __tablename__ = "consultas"

    id = Column(Integer, primary_key=True, index=True)
    idoso_id = Column(Integer, ForeignKey("idosos.id", ondelete="CASCADE"), nullable=False, index=True)
    data_consulta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    nome_medico = Column(String(150), nullable=False)
    observacao = Column(Text, nullable=True)
    local = Column(String(150), nullable=True)

    idoso = relationship("Idoso", back_populates="consultas")
