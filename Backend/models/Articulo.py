

from pydantic import BaseModel


class Articulo(BaseModel):
        id: str
        titulo: str
        resumen: str
        url: str