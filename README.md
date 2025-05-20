

Instrucciones de configuración y ejecución.

Descarga el Proyecto 
Ábrelo en visual Code
valla al archivo conexion_BD.py y cambie las credenciales de la BD de progress por la de la pc donde este probando el projecto.
Divide la terminar en dos haciendo click en powershell y luego en split terminal o presiona Ctrl+Shift+5

En una de las terminales haz esto:

Pasos para iniciar el backend (API):

1- cd .\Backend\

2- python -m venv env

3- env/scripts/activate.ps1

4-instala las dependencias del archivo requirements.txt, de esta forma:

pip install -r requirements.txt

5- uvicorn Endpoints:app

En la otra terminar esto:

Pasos para iniciar el frontend (Visual):

1- cd .\Frontend\

2-npm install

3-npx expo start

4-espere a que presente un menú de opciones en la terminar

5-presione w para abrir en el navegador





Breve descripción de decisiones de diseño y arquitectura.

Dado los requisitos, se opto por utilizar:

React native para la visual

python para backend y API

como base de datos se utilizo la ultima version de progress

Para mayor agilidad de navegacion se opto por un diseño de 2 pestañas en la visual una para buscar articulos y otra para listar los articulos guardados.





Definición de los endpoints de la API.

Con la api en ejecucion ingresando al siguiente enlace puede ver la definicion de todos los endpoints de la API en el swagger:
http://127.0.0.1:8000/docs

Definiciones:
1. Buscar artículos en Wikipedia

Ruta: /buscar

Método: GET

Descripción: Realiza una búsqueda de artículos relacionados con el término ingresado utilizando la API pública de Wikipedia.

Parámetros de query:

termino (string, requerido): Palabra clave a buscar. Mínimo 1 carácter.

Respuesta:

[
  {
    "titulo": "Python (lenguaje de programación)",
    "id": "23862",
    "url": "https://es.wikipedia.org/?curid=23862"
  }
]

2. Obtener resumen procesado de un artículo
Ruta: /buscar_articulo

Método: GET

Descripción: Devuelve el resumen de un artículo de Wikipedia junto con un análisis de las palabras más frecuentes (sin stopwords).

Parámetros de query:

termino (string, requerido): Título del artículo.

Respuesta:

{
  "resumen": "Python es un lenguaje de programación...",
  "palabras_frecuentes": {
    "python": 5,
    "programación": 3,
    "lenguaje": 2
  },
  "cantidad_palabras": 50
}

3. Guardar artículo en base de datos
Ruta: /guardar

Método: POST

Descripción: Guarda un artículo procesado (ID, título, resumen, URL) en la base de datos local.

Cuerpo (body) del request:

json
Copiar
Editar
{
  "id": "23862",
  "titulo": "Python",
  "resumen": "Python es un lenguaje de programación...",
  "url": "https://es.wikipedia.org/?curid=23862"
}
Respuesta:

"Articulo guardado!"

4. Obtener todos los artículos guardados
Ruta: /articulos/

Método: GET

Descripción: Retorna todos los artículos almacenados previamente en la base de datos.

Respuesta:

[
  {
    "id": "23862",
    "titulo": "Python",
    "resumen": "Python es un lenguaje...",
    "url": "https://es.wikipedia.org/?curid=23862"
  }
]

5. Eliminar un artículo por ID
Ruta: /borrar_articulo

Método: PUT

Descripción: Elimina un artículo guardado en la base de datos por su ID.

Parámetros de query:

id (int, requerido): ID del artículo a eliminar.

Respuesta:

"Articulo borrado!"
