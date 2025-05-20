import re
from fastapi import Depends, FastAPI, HTTPException, Query # type: ignore
import httpx  # type: ignore # Cliente HTTP asíncrono para hacer peticiones a Wikipedia
from typing import Counter, Dict, List
from fastapi.middleware.cors import CORSMiddleware # type: ignore
from pydantic import BaseModel # type: ignore
from psycopg2.extensions import connection as conexion # type: ignore
from models.analisisResumen import AnalisisResumen
from models.Articulo import Articulo

from conexion_BD import get_db

app = FastAPI()

app.title =  "Endpoint busqueda"

app.version = "1.0"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


STOP_WORDS = {
    "de", "la", "que", "el", "en", "y", "a", "los", "del", "se", "las", "por", 
    "un", "para", "con", "no", "una", "su", "al", "lo", "como", "más", "pero",
    "sus", "le", "ya", "o", "este", "sí", "porque", "esta", "entre", "cuando"
}

# Ruta GET que busca artículos relacionados con un término en Wikipedia
@app.get("/buscar", response_model=List[Dict[str, str]], tags=["Busqueda"])
async def buscar_wikipedia(termino: str = Query(..., min_length=1, description="Ingrese un término de búsqueda")):


    # URL de la API pública de Wikipedia (opensearch devuelve una lista simple)
    wikipedia_api_url = "https://es.wikipedia.org/w/api.php"

    # Parámetros que Wikipedia espera en la búsqueda 
    parametros = {
        "action": "query",  
         "list": "search",
        "format": "json",        # formato de respuesta
         "srsearch": termino # término que envía el usuario
    }

    try:
    # Usamos httpx para hacer una solicitud GET asíncrona
        async with httpx.AsyncClient() as client:
            response = await client.get(wikipedia_api_url, params=parametros)
            response.raise_for_status()  # lanza error si el status HTTP no es 200
            data = response.json()

            articulos = []
            for item in data["query"]["search"]:
                titulo = item["title"]
                pageid = item["pageid"]
                url = f"https://es.wikipedia.org/?curid={pageid}"

                articulos.append({
                    "titulo": titulo,
                    "id": str(pageid),
                    "url": url
                })

            return articulos

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error inesperado: {e}")
    finally:
        pass 

    # Ruta GET que busca artículos en Wikipedia
@app.get("/buscar_articulo", response_model=AnalisisResumen, tags=["Busqueda"])
async def buscar_articulo(termino: str = Query(..., min_length=1, description="Ingrese un articulo")):
  
    # URL de la API pública de Wikipedia
    wikipedia_api_url = "https://es.wikipedia.org/w/api.php"

    # Parámetros para obtener el resumen
    parametros = {
        "action": "query",
        "titles": termino,
        "prop": "extracts",
        "exintro": True,
        "explaintext": True,
        "format": "json"
    }

    try:
        # Usamos httpx para hacer una solicitud GET asíncrona
        async with httpx.AsyncClient() as client:
            response = await client.get(wikipedia_api_url, params=parametros)
            response.raise_for_status()  # Lanza error si el status HTTP no es 200

            data = response.json()
            resumen = (
    data.get("query", {})
        .get("pages", {})
        .get(next(iter(data.get("query", {}).get("pages", {}))), {})
        .get("extract")
)
            palabras = re.findall(r'\b\w+\b', resumen.lower())  # Extrae palabras y pasa a minúscula
            palabras_filtradas = [p for p in palabras if p not in STOP_WORDS and len(p) > 2]

            contador = Counter(palabras_filtradas)
            palabras_frecuentes = dict(contador.most_common(10))  # Puedes limitar a 5 si prefieres

            return AnalisisResumen(
                resumen=resumen,
                palabras_frecuentes=palabras_frecuentes,
                cantidad_palabras=len(palabras_filtradas)

            )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error inesperado: {e}")
    finally:
        pass 



@app.post('/guardar', response_model=str, tags=['Crud'])
def crear_articulo (articulo: Articulo, conn: conexion = Depends(get_db) ):
       
# Crear un cursor
    try:
               
        cur = conn.cursor()

        cur.execute("""
        CREATE TABLE IF NOT EXISTS articulos (
        id BIGINT PRIMARY KEY,
        titulo_wikipedia TEXT NOT NULL,
        resumen_procesado TEXT,
        url_wikipedia TEXT,
        fecha_guardado date default CURRENT_DATE 
        );
        """)
     
        cur = conn.cursor()
        
# Insertar datos en la tabla
        cur.execute("""
        INSERT INTO articulos (id,titulo_wikipedia, resumen_procesado, url_wikipedia)
        VALUES (%s, %s, %s, %s)
        """, (articulo.id, articulo.titulo, articulo.resumen,articulo.url))

        # Confirmar la transacción
        conn.commit()

        # Cerrar conexiones
        cur.close()
        conn.close()

        return "Articulo guardado!"

    except Exception as e:
        #raise HTTPException(f"Ocurrió un error inesperado: {e}")
        return f"Ocurrió un error inesperado: {e}"

    finally:
        pass 


# Endpoint para obtener todos los artículos
@app.get('/articulos/', response_model=List[Articulo], tags=['Crud'])
async def get_articulos( conn: conexion = Depends(get_db)):

    try:

        cur = conn.cursor()

        cur.execute("SELECT id, titulo_wikipedia, resumen_procesado, url_wikipedia,fecha_guardado FROM articulos")
        rows = cur.fetchall()

        articulos = []
        for row in rows:
            articulos.append(Articulo(
                id=str(row[0]),
                titulo=row[1],
                resumen=row[2],
                url=row[3]
            ))

        cur.close()
        conn.close()

        return articulos

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocurrió un error inesperado: {e}")
    

    # Endpoint para obtener todos los artículos
@app.put('/borrar_articulo', response_model=str, tags=['Crud'])
async def borrar_articulos(id: int = Query(..., description="ID del artículo a borrar"), conn: conexion = Depends(get_db)):

    try:

        cur = conn.cursor()

        cur.execute("Delete FROM articulos where id=%s",(id,))

        conn.commit()

        cur.close()
        conn.close()

        return "Articulo borrado!"

    except Exception as e:
        return f"Ocurrió un error inesperado: {e}"

