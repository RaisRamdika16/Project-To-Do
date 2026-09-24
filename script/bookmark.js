const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const container = document.getElementById("taskListContainer");

function renderTasks() {
  container.innerHTML = "";

  // 1. Ambil task yang dibookmark beserta index aslinya di array 'tasks'
  const bookmarkedTasks = tasks
    .map((task, originalIndex) => ({ ...task, originalIndex }))
    .filter((task) => task.bookmarked);

  if (!bookmarkedTasks.length) {
    container.innerHTML = `
      <p class="text-gray-400 font-medium text-lg tracking-wide text-center py-4">
        No saved tasks yet.
      </p>
    `;
    return;
  }

  // 2. Loop setiap task yang dibookmark
  bookmarkedTasks.forEach((task) => {
    const taskItem = document.createElement("div");
    taskItem.className =
      "flex w-full items-center justify-between gap-4 border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-xs";

    const taskInfo = document.createElement("div");
    taskInfo.className = "flex flex-1 items-center gap-3 min-w-0";

    // 3. Buat Bookmark Button interaktif (menggantikan bookmarkIcon statis)
    const bookmarkButton = document.createElement("button");
    bookmarkButton.type = "button";
    bookmarkButton.id = `bookmarkBtn-${task.originalIndex}`; // ID Unik per elemen
    bookmarkButton.className = `transition-colors p-1 shrink-0 ${
      task.bookmarked ? "text-blue-600" : "text-gray-400 hover:text-blue-500"
    }`;
    bookmarkButton.setAttribute("aria-label", "Toggle bookmark");
    bookmarkButton.innerHTML = `
      <svg class="w-5 h-5" fill="${task.bookmarked ? "currentColor" : "none"}" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
    `;

    // 4. Handler Click untuk Toggle Bookmark
    bookmarkButton.addEventListener("click", () => {
      // Mengubah status bookmarked menggunakan index asli dari array 'tasks'
      tasks[task.originalIndex].bookmarked =
        !tasks[task.originalIndex].bookmarked;

      // Simpan perubahan ke LocalStorage
      localStorage.setItem("tasks", JSON.stringify(tasks));

      // Re-render tampilan
      renderTasks();
    });

    const taskName = document.createElement("span");
    taskName.className = "text-sm text-gray-800 font-medium truncate";
    taskName.textContent = task.name || "Untitled Task";

    const taskDate = document.createElement("span");
    taskDate.className = "text-xs text-gray-400 whitespace-nowrap";
    taskDate.textContent =
      task.due_date || task.date || task.dueDate || "Today";

    // Susun elemen DOM
    taskInfo.append(bookmarkButton, taskName);
    taskItem.append(taskInfo, taskDate);
    container.appendChild(taskItem);
  });
}

renderTasks();
