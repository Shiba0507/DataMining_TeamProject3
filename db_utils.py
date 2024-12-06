import sqlite3
from flask import g

DB_NAME = 'user_manga.db'

def get_db_connection():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_NAME)
        g.db.row_factory = sqlite3.Row
    return g.db

def close_db_connection():
    db = g.pop('db', None)
    if db:
        db.close()
