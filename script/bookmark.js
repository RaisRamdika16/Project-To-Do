const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const container = document.getElementById("taskListContainer");

function renderTasks() {
  container.innerHTML = "";

  const bookmarkedTasks = tasks.filter((task) => task.bookmarked);

  if (!bookmarkedTasks.length) {
    container.innerHTML = `
            <p class="text-gray-400 font-medium text-lg tracking-wide">
              No saved tasks yet.
            </p>
          `;
    return;
  }

  bookmarkedTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className =
      "flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-xs";

    const taskInfo = document.createElement("div");
    taskInfo.className = "flex items-center space-x-3";

    const bookmarkIcon = document.createElement("span");
    bookmarkIcon.className = "text-blue-600";
    bookmarkIcon.innerHTML = `
            <svg class="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          `;

    const taskName = document.createElement("span");
    taskName.className = "text-sm text-gray-800 font-medium";
    taskName.textContent = task.name;

    const taskDate = document.createElement("span");
    taskDate.className = "text-xs text-gray-400";
    taskDate.textContent = task.date;

    taskInfo.append(bookmarkIcon, taskName);
    taskItem.append(taskInfo, taskDate);
    container.appendChild(taskItem);
  });
}

renderTasks();
