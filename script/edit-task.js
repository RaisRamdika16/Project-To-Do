const params = new URLSearchParams(window.location.search);
const queryTaskIndex = Number.parseInt(params.get("id"), 10);
const savedTaskIndex = Number.parseInt(
  localStorage.getItem("selectedTaskIndex"),
  10,
);
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const savedTask = JSON.parse(localStorage.getItem("selectedTask") || "null");

const taskIndex = Number.isInteger(queryTaskIndex)
  ? queryTaskIndex
  : savedTaskIndex;

// Ambil data dari array tasks utama, jika gagal pakai fallback savedTask
const task =
  Number.isInteger(taskIndex) && tasks[taskIndex]
    ? tasks[taskIndex]
    : savedTask;

const titleEl = document.getElementById("taskTitle");
const descriptionEl = document.getElementById("taskDescription");
const dateEl = document.getElementById("taskDate");
const priorityEl = document.getElementById("taskPriority");
const statusEl = document.getElementById("taskStatus");
const createdAtEl = document.getElementById("taskCreatedAt");
const completeButton = document.getElementById("completeButton");
const deleteButton = document.getElementById("deleteButton");

function setPriorityBadge(value) {
  const normalized = (value || "medium").toLowerCase();
  let classes =
    "inline-flex items-center px-3 py-1 rounded-sm text-sm font-semibold ";

  if (normalized === "low") {
    classes += "bg-green-100 text-green-700";
  } else if (normalized === "high") {
    classes += "bg-red-100 text-red-700";
  } else {
    classes += "bg-yellow-200 text-yellow-800";
  }

  const label = value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Medium";
  priorityEl.innerHTML = `<span class="${classes}">${label}</span>`;
}

function setStatusBadge(completed) {
  if (completed) {
    statusEl.innerHTML =
      '<span class="inline-flex items-center px-3 py-1 rounded-sm text-sm font-semibold bg-green-100 text-green-700">Completed</span>';
    completeButton.textContent = "Completed";
    completeButton.disabled = true;
    completeButton.classList.add("opacity-80", "cursor-not-allowed");
    completeButton.classList.remove("hover:bg-blue-600");
  } else {
    statusEl.innerHTML =
      '<span class="inline-flex items-center px-3 py-1 rounded-sm text-sm font-semibold bg-blue-100 text-blue-700">In Progress</span>';
    completeButton.textContent = "Mark as Completed";
    completeButton.disabled = false;
    completeButton.classList.remove("opacity-80", "cursor-not-allowed");
    completeButton.classList.add("hover:bg-blue-600");
  }
}

if (!task) {
  titleEl.textContent = "Task not found";
  descriptionEl.textContent = "This task could not be loaded.";
  dateEl.textContent = "-";
  createdAtEl.textContent = "-";
  setPriorityBadge("medium");
  setStatusBadge(false);
  completeButton.disabled = true;
} else {
  // Fallback lengkap untuk menangani berbagai alternatif nama property
  titleEl.textContent =
    task.name || task.title || task.taskName || "Untitled Task";
  descriptionEl.textContent =
    task.description || task.desc || "No description provided.";
  dateEl.textContent = task.date || task.dueDate || task.deadline || "-";
  createdAtEl.textContent = task.createdAt || task.date || task.dueDate || "-";
  setPriorityBadge(task.priority || "medium");
  setStatusBadge(Boolean(task.completed));
}

// Handler Tombol Completed yang langsung mengupdate Array LocalStorage utama
completeButton.addEventListener("click", () => {
  if (Number.isInteger(taskIndex) && tasks[taskIndex]) {
    tasks[taskIndex].completed = true;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  if (task) {
    task.completed = true;
    localStorage.setItem("selectedTask", JSON.stringify(task));
  }
  setStatusBadge(true);
});

// Handler Tombol Delete di Halaman Detail
deleteButton.addEventListener("click", () => {
  if (Number.isInteger(taskIndex) && tasks[taskIndex]) {
    tasks.splice(taskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.removeItem("selectedTask");
    localStorage.removeItem("selectedTaskIndex");
    window.location.href = "home.html";
  }
});
