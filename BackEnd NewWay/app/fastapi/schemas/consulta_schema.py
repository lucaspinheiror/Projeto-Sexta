from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ConsultaBase(BaseModel):
    idoso_id: int = Field(gt=0)
    data_consulta: datetime
    nome_medico: str = Field(min_length=3, max_length=100)
    observacao: str | None = Field(default=None, max_length=500)
    local: str | None = Field(default=None, max_length=150)


class ConsultaCreate(ConsultaBase):
    idoso_id: int = Field(gt=0)
    data_consulta: datetime
    nome_medico: str = Field(min_length=3, max_length=100)
    observacao: str | None = Field(default=None, max_length=500)
    local: str | None = Field(default=None, max_length=150)


class ConsultaUpdate(BaseModel):
    idoso_id: int | None = Field(default=None, gt=0)
    data_consulta: datetime
    nome_medico: str = Field(min_length=3, max_length=100)
    observacao: str | None = Field(default=None, max_length=500)
    local: str | None = Field(default=None, max_length=150)


class ConsultaRead(ConsultaBase):
    id: int

    model_config = ConfigDict(from_attributes=True)