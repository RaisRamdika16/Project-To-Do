let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const legacyCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"));
if (!tasks.length && legacyCompletedTasks && legacyCompletedTasks.length) {
  tasks = legacyCompletedTasks;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.removeItem("completedTasks");
}

const container = document.getElementById("taskListContainer");

function renderTasks() {
  container.innerHTML = "";

  const completedTasks = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => task.completed);

  if (!completedTasks.length) {
    container.innerHTML = `
          <p class="text-gray-400 font-medium text-lg tracking-wide">
            No completed tasks yet.
          </p>
        `;
    return;
  }

  completedTasks.forEach(({ task, index }) => {
    const taskItem = document.createElement("div");
    taskItem.className =
      "flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-xs transition-all";

    const taskLeft = document.createElement("div");
    taskLeft.className =
      "flex items-center space-x-3 cursor-pointer select-none";
    taskLeft.addEventListener("click", () => toggleTask(index));

    const checkbox = document.createElement("div");
    checkbox.className =
      "w-5 h-5 rounded border bg-green-500 border-green-500 text-white flex items-center justify-center text-xs transition-colors";
    checkbox.innerHTML = `
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          `;

    const taskName = document.createElement("span");
    taskName.className = "text-sm line-through text-gray-800 font-medium";
    taskName.textContent = task.name;

    const rightSide = document.createElement("div");
    rightSide.className = "flex items-center gap-3";

    const taskDate = document.createElement("span");
    taskDate.className = "text-xs text-gray-400";
    taskDate.textContent = task.due_date || task.date || task.dueDate || "";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.type = "button";
    bookmarkButton.className = `transition-colors p-1 ${
      task.bookmarked ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
    }`;
    bookmarkButton.setAttribute("aria-label", "Bookmark completed task");
    bookmarkButton.innerHTML = `
            <svg class="w-5 h-5" fill="${task.bookmarked ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          `;

    bookmarkButton.addEventListener("click", (event) => {
      event.stopPropagation();
      tasks[index].bookmarked = !tasks[index].bookmarked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
      "text-gray-400 hover:text-red-500 transition-colors p-1";
    deleteButton.setAttribute("aria-label", "Delete completed task");
    deleteButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18m-5 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"/>
            </svg>
          `;

    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldDelete = window.confirm(
        "Apakah kamu yakin ingin menghapus todo list ini?",
      );
      if (!shouldDelete) return;

      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskLeft.append(checkbox, taskName);
    rightSide.append(taskDate, bookmarkButton, deleteButton);
    taskItem.append(taskLeft, rightSide);
    container.appendChild(taskItem);
  });
}

window.toggleTask = function (index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
};

renderTasks();
