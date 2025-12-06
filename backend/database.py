import mysql.connector
from dotenv import load_dotenv
import os

load_dotenv()

db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '14112006',
    'database': 'pharmacy_shop'
}

def get_db():
    conn = mysql.connector.connect(**db_config)
    try:
        yield conn
    finally:
        conn.close()