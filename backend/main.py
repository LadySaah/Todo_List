import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Todo(BaseModel):
    id: int
    title: str
    description: str
    completed: bool


class TodoCreate(BaseModel):
    title: str
    description: str


class TodoUpdate(BaseModel):
    completed: bool


def get_connection():
    connection = sqlite3.connect("todos.db")
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    connection = get_connection()
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )
        """
    )

    existing = connection.execute("SELECT COUNT(*) FROM todos").fetchone()[0]
    if existing == 0:
        todos = [
            ("Wash the Dishes",
             "Clean all plates, cups, and utensils from last night's dinner", 0),
            ("Finish History Essay",
             "Submit the first draft before Friday", 0),
            ("Take Out the Trash",
             "Empty all bins and replace the liners", 1),
            ("Call Mum",
             "Check in and plan the weekend visit", 0),
            ("Make the Bed",
             "Change the sheets and fluff the pillows", 1),
            ("Buy Groceries",
             "Milk, eggs, bread, and coffee", 0),
            ("Book Dentist Appointment",
             "Routine check-up — any weekday afternoon", 0),
        ]
        connection.executemany(
            "INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)",
            todos,
        )

    connection.commit()
    connection.close()


initialize_database()


@app.get("/")
def home():
    return {"message": "Todo API is running"}


@app.get("/todos", response_model=list[Todo])
def get_todos():
    connection = get_connection()
    cursor = connection.execute("SELECT * FROM todos")
    rows = cursor.fetchall()
    connection.close()
    return [Todo(**dict(row)) for row in rows]


@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(payload: TodoCreate):
    connection = get_connection()
    cursor = connection.execute(
        "INSERT INTO todos (title, description, completed) VALUES (?, ?, ?)",
        (payload.title, payload.description, 0),
    )
    new_id = cursor.lastrowid
    connection.commit()
    row = connection.execute(
        "SELECT * FROM todos WHERE id = ?", (new_id,)
    ).fetchone()
    connection.close()
    return Todo(**dict(row))


@app.put("/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, payload: TodoUpdate):
    connection = get_connection()
    existing = connection.execute(
        "SELECT * FROM todos WHERE id = ?", (todo_id,)
    ).fetchone()

    if existing is None:
        connection.close()
        raise HTTPException(status_code=404, detail="Todo not found")

    connection.execute(
        "UPDATE todos SET completed = ? WHERE id = ?",
        (int(payload.completed), todo_id),
    )
    connection.commit()

    row = connection.execute(
        "SELECT * FROM todos WHERE id = ?", (todo_id,)
    ).fetchone()
    connection.close()
    return Todo(**dict(row))
