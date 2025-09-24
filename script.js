const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const messageBox = document.getElementById('messageBox');
const searchBox = document.getElementById('searchBox');
const filterPriority = document.getElementById('filterPriority');
const filterStatus = document.getElementById('filterStatus');
const filterDate = document.getElementById('filterDate');

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ---------- Sauvegarde des tâches dans le local storage ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ---------- Afficher un message d'ajout ou de suppression ----------
function showMessage(text, color="green") {
  messageBox.textContent = text;
  messageBox.style.color = color;
  messageBox.classList.add("show");
  setTimeout(() => messageBox.classList.remove("show"), 2000);
}


// ---------- Affichage des tâches ajoutees ----------
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task => {
    if (searchBox.value && !task.title.toLowerCase().includes(searchBox.value.toLowerCase())) return false;
    if (filterPriority.value !== "all" && task.priority !== filterPriority.value) return false;
    if (filterStatus.value === "complete" && !task.complete) return false;
    if (filterStatus.value === "incomplete" && task.complete) return false;
    if (filterDate.value && task.date !== filterDate.value) return false;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const card = document.createElement('div');
    card.className = `task-card ${task.complete ? "complete" : ""}`;

    card.innerHTML = `
      <div class="task-header">
        <h3>${task.title}</h3>
        <button class="delete-btn">&times;</button>
      </div>
      <p>Date d’échéance : ${task.date}</p>
      <p class="priority-${task.priority}">Priorité : ${task.priority}</p>
      <label>
        <input type="checkbox" ${task.complete ? "checked" : ""}>
        Complète
      </label>
    `;


    // ----------------------- Supprimer une tâche --------------------
    card.querySelector('.delete-btn').addEventListener('click', () => {
      card.style.opacity = "0";
      card.style.transform = "translateX(50px)";
      setTimeout(() => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        showMessage("Tâche supprimée avec succes", "red");
      }, 300);
    });


    // ------------------------- Marquer des tâches comme complétée ---------------------
    card.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      task.complete = e.target.checked;
      saveTasks();
      renderTasks();
      showMessage("Statut mis à jour");
    });

    taskList.appendChild(card);
  });
}


// ---------- Ajouter des tâches ----------
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value;
  const date = document.getElementById('taskDate').value;
  const priority = document.getElementById('taskPriority').value;

  tasks.push({ title, date, priority, complete: false });
  saveTasks();
  renderTasks();
  showMessage("Tâche ajoutée !");
  taskForm.reset();
});


// ---------- Filtres et recherche des tâches en temps réèl ----------
[filterPriority, filterStatus, filterDate, searchBox].forEach(el => {
  el.addEventListener('input', renderTasks);
});

renderTasks();
