# Submission Notes — My Todo List

## HTML elements identified from reference image
- `<header>` with profile icon, name, and "My Todo List" heading
- `<main id="todo-list">` container holding each task card
- Each card: `<h2>` title, `<p>` description, `<div class="todo-status">` circle
- A "New Task" row at the bottom with two `<input>` fields and a ＋ button

## Frontend challenges
- The script was originally placed in `<head>`, so it ran before `<main id="todo-list">` existed and the fetch loop failed silently. Fixed by moving `<script>` to just before `</body>`.
- A hidden `.txt` extension on `script.js` caused a 404 in the browser. Fixed by re-saving the file in VS Code.
- Making completed vs incomplete visually distinct — solved with a `.completed` class that switches the border/background to sage green and shows a ✓ circle.

## Backend challenges
- CORS blocked the frontend from calling the API. Fixed with `CORSMiddleware` allowing all origins.
- SQLite stores booleans as 0/1; Pydantic coerces them automatically when constructing `Todo(**dict(row))`.
- Single-parameter queries need a trailing comma: `(todo_id,)`.

## Data flow
1. SQLite (`todos.db`) stores each task as a row in the `todos` table.
2. FastAPI's `GET /todos` runs `SELECT * FROM todos`, converts rows into Pydantic `Todo` objects, and returns JSON.
3. The browser's `fetch()` calls the endpoint, receives JSON, and dynamically creates HTML elements for each task.
4. Adding a task POSTs to `/todos`; the server runs INSERT + commit; the frontend calls `loadTodos()` to re-render.
5. Toggling a task PUTs to `/todos/{id}`; the server runs UPDATE + commit; the frontend re-renders.

## Bonus questions
1. **When a POST request is sent, is the item automatically stored in the database?**  
   No. POST delivers data to the server; the server must explicitly run an INSERT and `connection.commit()`.
2. **What must the backend do before the new todo becomes permanent?**  
   Run a parameterized `INSERT INTO todos (...) VALUES (?, ?, ?)` and call `connection.commit()`.
3. **After creating a todo, how would you make it appear on the page?**  
   Call `loadTodos()` again, or use the object returned by the POST response and append a card directly.
4. **How would you avoid displaying thousands of todo items at the same time?**  
   Pagination (LIMIT/OFFSET), infinite scroll / lazy loading, or virtualised lists.
5. **What information should the frontend send when a todo is marked complete?**  
   The todo's `id` (in the URL) and the new `completed` value (in the JSON body).
6. **Why should SQL queries use parameters instead of placing user values directly in the query string?**  
   To prevent SQL injection — parameters treat values as data, not executable SQL.


## Note on the archived Stage 1 script

`frontend/script-stage1.js` is an archived copy of the original Stage 1
script that used a hardcoded JavaScript array of tasks. It was replaced
in Stage 3 with `script.js`, which fetches tasks from the FastAPI backend. 