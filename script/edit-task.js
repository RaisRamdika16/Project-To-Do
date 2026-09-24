const params = new URLSearchParams(window.location.search);
const queryTaskIndex = Number.parseInt(params.get("id"), 10);
const savedTaskIndex = Number.parseInt(
  localStorage.getItem("selectedTaskIndex"),
  10,
);
const editTaskIndex = Number.parseInt(
  localStorage.getItem("editTaskIndex"),
  10,
);
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const selectedTask = JSON.parse(localStorage.getItem("selectedTask") || "null");
const editTask = JSON.parse(localStorage.getItem("editTask") || "null");

const taskIndex = Number.isInteger(queryTaskIndex)
  ? queryTaskIndex
  : Number.isInteger(editTaskIndex)
    ? editTaskIndex
    : Number.isInteger(savedTaskIndex)
      ? savedTaskIndex
      : null;

const task =
  Number.isInteger(taskIndex) && tasks[taskIndex]
    ? tasks[taskIndex]
    : editTask || selectedTask;

const form = document.getElementById("editTaskForm");
const nameInput = document.getElementById("taskName");
const descriptionInput = document.getElementById("taskDescription");
const priorityInput = document.getElementById("taskPriority");
const dateInput = document.getElementById("taskDate");
const statusInput = document.getElementById("taskStatus");
const createdAtInput = document.getElementById("taskCreatedAt");

function toISODate(value) {
  if (!value) return "";

  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) return value;

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const timezoneOffset = parsedDate.getTimezoneOffset();
  const localDate = new Date(parsedDate.getTime() - timezoneOffset * 60 * 1000);
  return localDate.toISOString().split("T")[0];
}

function getTodayAsISODate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function formatDateForDisplay(value) {
  if (!value) return "Today";

  const dateOnlyMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const parsedDate = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3]),
      )
    : new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function populateForm(taskData) {
  if (!taskData) return;

  nameInput.value = taskData.name || taskData.title || taskData.taskName || "";
  descriptionInput.value = taskData.description || taskData.desc || "";
  priorityInput.value = (taskData.priority || "medium").toLowerCase();
  dateInput.value = toISODate(
    taskData.due_date ||
      taskData.date ||
      taskData.dueDate ||
      taskData.deadline ||
      "",
  );
  statusInput.value = taskData.completed ? "completed" : "in-progress";
  createdAtInput.value = toISODate(
    taskData.created_at || taskData.createdAt || getTodayAsISODate(),
  );
}

if (!task) {
  nameInput.value = "";
  descriptionInput.value = "";
  priorityInput.value = "medium";
  dateInput.value = "";
  statusInput.value = "in-progress";
  createdAtInput.value = getTodayAsISODate();
} else {
  populateForm(task);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const updatedTask = {
    ...(task || {}),
    name: nameInput.value.trim() || "Untitled Task",
    description: descriptionInput.value.trim(),
    priority: priorityInput.value || "medium",
    due_date: dateInput.value ? formatDateForDisplay(dateInput.value) : "Today",
    completed: statusInput.value === "completed",
    created_at:
      task?.created_at ||
      task?.createdAt ||
      formatDateForDisplay(getTodayAsISODate()),
  };

  updatedTask.date = updatedTask.due_date;
  updatedTask.createdAt = updatedTask.created_at;

  if (Number.isInteger(taskIndex) && tasks[taskIndex]) {
    tasks[taskIndex] = updatedTask;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } else if (task) {
    Object.assign(task, updatedTask);
    localStorage.setItem("selectedTask", JSON.stringify(task));
  }

  localStorage.setItem("selectedTask", JSON.stringify(updatedTask));
  localStorage.setItem("selectedTaskIndex", String(taskIndex ?? 0));
  localStorage.removeItem("editTask");
  localStorage.removeItem("editTaskIndex");

  if (Number.isInteger(taskIndex) && tasks[taskIndex]) {
    window.location.href = "home.html";
    return;
  }

  window.location.href = "home.html";
});
