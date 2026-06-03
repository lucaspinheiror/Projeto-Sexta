from pydantic import BaseModel, ConfigDict, Field


class IdosoBase(BaseModel):
    nome: str = Field(min_length=1, max_length=200)
    altura: float | None = Field(default=None, gt=0, le=3)
    idade: int | None = Field(default=None, ge=60, le=130)
    peso: float | None = Field(default=None, gt=0, le=300)
    senha: str = Field(min_length=8, max_length=100)



class IdosoCreate(IdosoBase):
    pass


class IdosoUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=1, max_length=200)
    altura: float | None = Field(default=None, gt=0, le=3)
    idade: int | None = Field(default=None, ge=60, le=130)
    peso: float | None = Field(default=None, gt=0, le=300)
    senha: str | None = Field(default=None, min_length=8, max_length=100)

class IdosoRead(IdosoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)

class IdosoLogin(BaseModel):
    nome: str
    senha: str