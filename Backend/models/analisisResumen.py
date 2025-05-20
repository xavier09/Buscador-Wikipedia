# models/analisisResumen.py

from pydantic import BaseModel
from typing import Dict

class AnalisisResumen(BaseModel):
    resumen: str
    cantidad_palabras: int
    palabras_frecuentes: Dict[str, int]
