const todoListElement = document.getElementById("todo-list");
const addChoreRow = document.querySelector(".add-chore");

const titleInput = document.getElementById("chore-title");
const descInput = document.getElementById("chore-description");
const addBtn = document.getElementById("add-chore-btn");



async function loadTodos() {
    try {
        const response = await fetch("http://127.0.0.1:8000/todos");
        const todos = await response.json();

        // Remove old cards but keep the .add-chore row
        document.querySelectorAll(".todo-item").forEach((el) => el.remove());

        todos.forEach((todo) => {
            const item = document.createElement("div");
            item.classList.add("todo-item");
            if (todo.completed) item.classList.add("completed");

            const title = document.createElement("h2");
            title.textContent = todo.title;

            const description = document.createElement("p");
            description.textContent = todo.description;

            const status = document.createElement("div");
            status.classList.add("todo-status");
            status.textContent = todo.completed ? "✓" : "○";
            status.style.cursor = "pointer";
            status.title = "Click to toggle";
            status.addEventListener("click", () =>
                toggleCompleted(todo.id, !todo.completed)
            );

            item.appendChild(title);
            item.appendChild(description);
            item.appendChild(status);

            todoListElement.insertBefore(item, addChoreRow);
        });
    } catch (err) {
        console.error("Failed to load todos:", err);
    }
}



async function addChore() {
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title || !description) {
        alert("Please fill in both the title and description.");
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description }),
        });

        if (!response.ok) throw new Error("Failed to add task");

        titleInput.value = "";
        descInput.value = "";
        loadTodos();
    } catch (err) {
        console.error("Failed to add task:", err);
        alert("Could not add the task. Is the backend running?");
    }
}


async function toggleCompleted(id, completed) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });

        if (!response.ok) throw new Error("Failed to update task");

        loadTodos();
    } catch (err) {
        console.error("Failed to update task:", err);
    }
}



addBtn.addEventListener("click", addChore);
[titleInput, descInput].forEach((input) =>
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addChore();
    })
);

loadTodos();