const todos = [
    { id: 1, title: "Wash the Dishes",
      description: "Clean all plates, cups, and utensils from last night's dinner",
      completed: false },
    { id: 2, title: "Finish History Essay",
      description: "Submit the first draft before Friday",
      completed: false },
    { id: 3, title: "Take Out the Trash",
      description: "Empty all bins and replace the liners",
      completed: true },
    { id: 4, title: "Call Mum",
      description: "Check in and plan the weekend visit",
      completed: false },
    { id: 5, title: "Make the Bed",
      description: "Change the sheets and fluff the pillows",
      completed: true },
];

const todoListElement = document.getElementById("todo-list");

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

    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(status);
    todoListElement.appendChild(item);
});