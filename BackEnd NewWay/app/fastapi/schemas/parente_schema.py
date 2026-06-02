from enum import Enum

from pydantic import BaseModel, ConfigDict, Field


class ParentescoEnum(str, Enum):
    neto = "neto"
    neta = "neta"
    filho = "filho"
    irmao = "irmao"
    outro = "outro"


class ParenteBase(BaseModel):
    idoso_id: int = Field(gt=0)
    nome: str = Field(min_length=1, max_length=200)
    idade: int | None = Field(default=None, ge=0, le=130)
    parentesco: ParentescoEnum
    telefone: str | None = Field(default=None, min_length=8, max_length=50)


class ParenteCreate(ParenteBase):
    pass


class ParenteUpdate(BaseModel):
    idoso_id: int | None = Field(default=None, gt=0)
    nome: str | None = Field(default=None, min_length=1, max_length=200)
    idade: int | None = Field(default=None, ge=0, le=130)
    parentesco: ParentescoEnum | None = None
    telefone: str | None = Field(default=None, min_length=8, max_length=50)


class ParenteRead(ParenteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)