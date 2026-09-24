document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Mencegah form reload bawaan HTML

  const name = document.getElementById("taskName").value;
  const desc = document.getElementById("taskDesc").value;
  const priority = document.getElementById("taskPriority").value;
  let dateVal = document.getElementById("taskDate").value;

  // Format tanggal (misal: "20 Aug 2026") agar mirip desainmu
  let formattedDate = "Today";
  if (dateVal) {
    const d = new Date(dateVal);
    const options = { day: "numeric", month: "short", year: "numeric" };
    formattedDate = d.toLocaleDateString("en-GB", options);
  }

  // Ambil data task aktif lama dari localStorage (kalau ada)
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Tambah task baru ke array
  tasks.push({
    name: name,
    description: desc,
    priority: priority,
    date: formattedDate,
    completed: false,
    bookmarked: false,
  });

  // Simpan kembali ke localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // Pindah otomatis ke halaman home
  window.location.href = "home.html";
});
