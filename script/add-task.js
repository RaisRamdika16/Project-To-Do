document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah form reload bawaan HTML

  const name = document.getElementById("taskName").value;
  const desc = document.getElementById("taskDesc").value;
  const priority = document.getElementById("taskPriority").value;
  let dateVal = document.getElementById("taskDate").value;

  const today = new Date();
  const createdAt = today.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Format tanggal (misal: "20 Aug 2026") agar mirip desainmu
  let formattedDueDate = "Today";
  if (dateVal) {
    const [year, month, day] = dateVal.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    const options = { day: "numeric", month: "short", year: "numeric" };
    formattedDueDate = d.toLocaleDateString("en-GB", options);
  }

  // Ambil data task aktif lama dari localStorage (kalau ada)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Tambah task baru ke array
  tasks.push({
    name: name,
    description: desc,
    priority: priority,
    due_date: formattedDueDate,
    created_at: createdAt,
    // Alias dipertahankan agar task lama tetap kompatibel.
    date: formattedDueDate,
    createdAt: createdAt,
    completed: false,
    bookmarked: false,
  });

  // Simpan kembali ke localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Pindah otomatis ke halaman home
  window.location.href = "home.html";
});
