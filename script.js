// Disable right-click
document.addEventListener("contextmenu", (e) => e.preventDefault());

// LocalStorage management
const taskList = document.getElementById("task-list");
const addTaskButton = document.getElementById("add-task");

// Retrieve tasks from localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Display tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const taskDiv = document.createElement("div");
    taskDiv.textContent = task;
    taskDiv.className = "task-item";
    taskDiv.addEventListener("click", () => {
      tasks.splice(index, 1); // Delete task on click
      updateTasks();
    });
    taskList.appendChild(taskDiv);
  });
}

// Add a new task
addTaskButton.addEventListener("click", () => {
  const task = prompt("Enter a task:");
  if (task) {
    tasks.push(task);
    updateTasks();
  }
});

// Update tasks in localStorage
function updateTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Initial rendering
renderTasks();
