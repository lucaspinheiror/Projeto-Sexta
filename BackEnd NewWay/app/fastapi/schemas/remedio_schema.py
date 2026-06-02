from pydantic import BaseModel, ConfigDict, Field


class RemedioBase(BaseModel):
    idoso_id: int = Field(gt=0)
    nome_remedio: str = Field(min_length=1, max_length=250)
    dosagem: str | None = Field(default=None, max_length=100)
    horario: str | None = Field(default=None, max_length=100)


class RemedioCreate(RemedioBase):
    pass


class RemedioUpdate(BaseModel):
    nome_remedio: str | None = Field(default=None, min_length=1, max_length=250)
    dosagem: str | None = Field(default=None, max_length=100)
    horario: str | None = Field(default=None, max_length=100)


class RemedioRead(RemedioBase):
    id: int

    model_config = ConfigDict(from_attributes=True)