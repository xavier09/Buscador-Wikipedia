
import psycopg2

def get_db():
    try:
        # cadena de conexion
        conn = psycopg2.connect(
            host="localhost",
            database="postgres", 
            user="postgres", #cambiar por el de su servidor de BD de postgres
            password="2310" #cambiar por el de su servidor de BD de postgres
        )
        yield conn
    finally:
        conn.close()