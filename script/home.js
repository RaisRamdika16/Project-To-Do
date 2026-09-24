let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const container = document.getElementById("taskListContainer");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");

function getFilteredTasks() {
  const keyword = (searchInput?.value || "").trim().toLowerCase();

  if (!keyword) {
    return tasks.filter((task) => !task.completed);
  }

  return tasks.filter(
    (task) =>
      !task.completed &&
      (task.name || task.title || "Untitled Task")
        .toLowerCase()
        .includes(keyword),
  );
}

function renderTasks() {
  container.innerHTML = "";

  const activeTasks = tasks
    .map((task, index) => ({ task, index }))
    .filter(({ task }) => !task.completed)
    .reverse();

  if (filteredTasks.length === 0) {
    container.innerHTML = `
      <p class="text-gray-400 font-medium text-lg tracking-wide">
        No tasks found.
      </p>
    `;
    return;
  }

  activeTasks.forEach(({ task, index }) => {
    const taskItem = document.createElement("div");
    taskItem.className =
      "flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-xs";

    const taskInfo = document.createElement("div");
    taskInfo.className = "flex items-center space-x-3";

    const taskName = document.createElement("button");
    taskName.type = "button";
    taskName.className =
      "text-left text-sm text-gray-800 font-medium hover:text-blue-600 transition-colors cursor-pointer";

    // Fallback jika property bernama name atau title
    taskName.textContent = task.name || task.title || "Untitled Task";

    taskName.addEventListener("click", () => {
      const originalIndex = tasks.findIndex((t) => t === task);
      const targetIndex = originalIndex !== -1 ? originalIndex : safeIndex;

      localStorage.setItem("selectedTaskIndex", String(targetIndex));
      localStorage.setItem("selectedTask", JSON.stringify(task));
      window.location.href = "detail_task.html?id=" + targetIndex;
    });

    const rightSide = document.createElement("div");
    rightSide.className = "flex items-center gap-3";

    const taskDate = document.createElement("span");
    taskDate.className = "text-xs text-gray-400";
    taskDate.textContent = task.date || task.dueDate || "";

    const completeButton = document.createElement("button");
    completeButton.type = "button";
    completeButton.className =
      "text-gray-400 hover:text-green-500 transition-colors p-1";
    completeButton.setAttribute("aria-label", "Mark task complete");
    completeButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          `;

    completeButton.addEventListener("click", () => {
      tasks[safeIndex].completed = true;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    const bookmarkButton = document.createElement("button");
    bookmarkButton.type = "button";
    bookmarkButton.className = `transition-colors p-1 ${
      task.bookmarked ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
    }`;
    bookmarkButton.setAttribute("aria-label", "Bookmark task");
    bookmarkButton.innerHTML = `
            <svg class="w-5 h-5" fill="${task.bookmarked ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
          `;

    bookmarkButton.addEventListener("click", () => {
      tasks[safeIndex].bookmarked = !tasks[safeIndex].bookmarked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
      "text-gray-400 hover:text-red-500 transition-colors p-1";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M3 7h18m-5 0V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3"/>
            </svg>
          `;

    deleteButton.addEventListener("click", () => {
      tasks.splice(safeIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
    });

    taskInfo.append(taskName);
    rightSide.append(taskDate, bookmarkButton, completeButton, deleteButton);
    taskItem.append(taskInfo, rightSide);
    container.appendChild(taskItem);
  });
}

searchInput?.addEventListener("input", renderTasks);
renderTasks();
