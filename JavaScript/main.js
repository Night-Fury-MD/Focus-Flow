let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let draggedIndex = null;

function addTask() {
  const input = document.getElementById("taskInput");

  if (!input.value.trim()) return;

  tasks.push({
    text: input.value,
    completed: false,
  });

  input.value = "";
  save();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  save();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  save();
}

function editTask(index) {
  let newText = prompt("Edit task:", tasks[index].text);

  if (newText) {
    tasks[index].text = newText;
    save();
  }
}

function dragStart(index) {
  draggedIndex = index;
}

function allowDrop(e) {
  e.preventDefault();
}

function dropTask(index) {
  let item = tasks.splice(draggedIndex, 1)[0];
  tasks.splice(index, 0, item);
  save();
}

function updateStats() {
  let remaining = tasks.filter((t) => !t.completed).length;
  document.getElementById("remaining").innerText = remaining;
}

function updateProgress() {
  let completed = tasks.filter((t) => t.completed).length;
  let total = tasks.length;

  let percent = total ? (completed / total) * 100 : 0;

  document.getElementById("progressFill").style.width = percent + "%";
  document.getElementById("progressText").innerText = Math.round(percent) + "%";
}

function toggleDark() {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

let CV = "all";
function changeview(view) {
  CV = view;
  document
    .querySelectorAll(".sidebar li")
    .forEach((li) => li.classList.remove("active"));

  if (view === "all")
    document.getElementById("view-all").classList.add("active");
  if (view === "tasks")
    document.getElementById("view-tasks").classList.add("active");
  if (view === "completed")
    document.getElementById("view-completed").classList.add("active");

  renderTasks();
}
function renderTasks() {
  const list = document.getElementById("taskList");
  let filterT = tasks;

  if (CV === "tasks") {
    filterT = tasks.filter((t) => !t.completed);
  } else if (CV === "completed") {
    filterT = tasks.filter((t) => t.completed);
  }

  if (filterT.length === 0) {
    let message = "Your sanctuary is clear! Add a task to start.";
    if (CV === "tasks") message = "Great job! No pending tasks at the moment.";
    if (CV === "completed")
      message = "You haven't finished any tasks yet. Keep going!";

    list.innerHTML = `
            <div class='empty' style="text-align: center; padding: 50px; opacity: 0.6;">
                <i class="fa-solid fa-wind" style="font-size: 3rem; margin-bottom: 15px; display: block;"></i>
                <p style="font-style: italic;">${message}</p>
            </div>`;

    updateStats();
    updateProgress();
    return;
  }

  let content = "";
  filterT.forEach((task) => {
    let realIndex = tasks.indexOf(task);
    content += `
            <div class="task-card ${task.completed ? "done" : ""}">
                <div class="task-check" onclick="toggleTask(${realIndex})">
                    ${task.completed ? "✔" : "⬜"}
                </div>
                <span>${task.text}</span>
                <div class="task-actions">
                    <button onclick="editTask(${realIndex})">✏️</button>
                    <button onclick="deleteTask(${realIndex})">❌</button>
                </div>
            </div>
        `;
  });

  list.innerHTML = content;
  updateStats();
  updateProgress();
}
document.getElementById("taskInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

renderTasks();
updateStats();
updateProgress();
