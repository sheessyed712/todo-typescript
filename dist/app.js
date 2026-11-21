"use strict";
const STORAGE_KEY = "ts_todo_tasks";
// 2. Typed DOM element references
const todoForm = document.getElementById("todoForm");
const taskNameInput = document.getElementById("taskName");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskList = document.getElementById("taskList");
// 3. Load saved tasks from localStorage
function loadTasks() {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData)
        return [];
    try {
        return JSON.parse(rawData);
    }
    catch (_a) {
        return [];
    }
}
// 4. Save tasks array to localStorage
function saveTasks(tasksToSave) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
}
let tasks = loadTasks();
// 5. Add a new task
function addTask(name, dueDate) {
    const newTask = {
        id: Date.now(),
        name,
        dueDate,
        completed: false
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}
// 6. Toggle completed / pending status
function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id ? Object.assign(Object.assign({}, task), { completed: !task.completed }) : task);
    saveTasks(tasks);
    renderTasks();
}
// 7. Delete a task
function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks(tasks);
    renderTasks();
}
// 8. Render all tasks onto the DOM
function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = `<li style="text-align:center; color:#777;">No tasks yet. Add one above!</li>`;
        return;
    }
    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        // Left side: checkbox + task name & due date
        const leftDiv = document.createElement("div");
        leftDiv.className = "task-left";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task.id));
        const detailsDiv = document.createElement("div");
        detailsDiv.className = "task-details";
        const nameSpan = document.createElement("span");
        nameSpan.className = "task-name";
        nameSpan.textContent = task.name;
        const dateSpan = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = `Due: ${task.dueDate}`;
        detailsDiv.appendChild(nameSpan);
        detailsDiv.appendChild(dateSpan);
        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(detailsDiv);
        // Right side: delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));
        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}
// 9. Handle form submission
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = taskNameInput.value.trim();
    const dueDate = taskDueDateInput.value;
    if (!name || !dueDate)
        return;
    addTask(name, dueDate);
    todoForm.reset();
});
// Initial render on page load
renderTasks();
