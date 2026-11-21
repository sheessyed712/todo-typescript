// 1. Define the Task interface
interface Task {
    id: number;
    name: string;
    dueDate: string;
    completed: boolean;
}

const STORAGE_KEY: string = "ts_todo_tasks";

// 2. Typed DOM element references
const todoForm = document.getElementById("todoForm") as HTMLFormElement;
const taskNameInput = document.getElementById("taskName") as HTMLInputElement;
const taskDueDateInput = document.getElementById("taskDueDate") as HTMLInputElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

// 3. Load saved tasks from localStorage
function loadTasks(): Task[] {
    const rawData: string | null = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];

    try {
        return JSON.parse(rawData) as Task[];
    } catch {
        return [];
    }
}

// 4. Save tasks array to localStorage
function saveTasks(tasksToSave: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
}

let tasks: Task[] = loadTasks();

// 5. Add a new task
function addTask(name: string, dueDate: string): void {
    const newTask: Task = {
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
function toggleTask(id: number): void {
    tasks = tasks.map((task: Task): Task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(tasks);
    renderTasks();
}

// 7. Delete a task
function deleteTask(id: number): void {
    tasks = tasks.filter((task: Task): boolean => task.id !== id);
    saveTasks(tasks);
    renderTasks();
}

// 8. Render all tasks onto the DOM
function renderTasks(): void {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `<li style="text-align:center; color:#777;">No tasks yet. Add one above!</li>`;
        return;
    }

    tasks.forEach((task: Task): void => {
        const li: HTMLLIElement = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        // Left side: checkbox + task name & due date
        const leftDiv: HTMLDivElement = document.createElement("div");
        leftDiv.className = "task-left";

        const checkbox: HTMLInputElement = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", (): void => toggleTask(task.id));

        const detailsDiv: HTMLDivElement = document.createElement("div");
        detailsDiv.className = "task-details";

        const nameSpan: HTMLSpanElement = document.createElement("span");
        nameSpan.className = "task-name";
        nameSpan.textContent = task.name;

        const dateSpan: HTMLSpanElement = document.createElement("span");
        dateSpan.className = "task-date";
        dateSpan.textContent = `Due: ${task.dueDate}`;

        detailsDiv.appendChild(nameSpan);
        detailsDiv.appendChild(dateSpan);

        leftDiv.appendChild(checkbox);
        leftDiv.appendChild(detailsDiv);

        // Right side: delete button
        const deleteBtn: HTMLButtonElement = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (): void => deleteTask(task.id));

        li.appendChild(leftDiv);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// 9. Handle form submission
todoForm.addEventListener("submit", (e: SubmitEvent): void => {
    e.preventDefault();

    const name: string = taskNameInput.value.trim();
    const dueDate: string = taskDueDateInput.value;

    if (!name || !dueDate) return;

    addTask(name, dueDate);
    todoForm.reset();
});

// Initial render on page load
renderTasks();