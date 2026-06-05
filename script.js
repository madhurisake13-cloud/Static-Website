const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    addTask();
  }
});

function addTask(){

  const text = taskInput.value.trim();

  if(text === ""){
    alert("Enter a task!");
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);

  taskInput.value = "";

  renderTasks();
}

function renderTasks(){

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "completed"){
    filteredTasks = tasks.filter(task => task.completed);
  }

  if(currentFilter === "pending"){
    filteredTasks = tasks.filter(task => !task.completed);
  }

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="task ${task.completed ? "completed" : ""}">
        <input type="checkbox"
        ${task.completed ? "checked" : ""}
        onchange="toggleTask(${task.id})">

        <span>${task.text}</span>
      </div>

      <div class="actions">

        <button class="edit-btn"
        onclick="editTask(${task.id})">
          <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn"
        onclick="deleteTask(${task.id})">
          <i class="fa-solid fa-trash"></i>
        </button>

      </div>
    `;

    taskList.appendChild(li);

  });

  updateStats();
}

function toggleTask(id){

  tasks = tasks.map(task => {

    if(task.id === id){
      task.completed = !task.completed;
    }

    return task;
  });

  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(task => task.id !== id);

  renderTasks();
}

function editTask(id){

  const task = tasks.find(task => task.id === id);

  const newText = prompt("Edit Task", task.text);

  if(newText !== null && newText.trim() !== ""){
    task.text = newText;
  }

  renderTasks();
}

function updateStats(){

  const total = tasks.length;

  const completed = tasks.filter(task => task.completed).length;

  const pending = total - completed;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;

  let percent = 0;

  if(total > 0){
    percent = Math.round((completed / total) * 100);
  }

  progress.style.width = percent + "%";

  progressText.textContent = percent + "% Completed";
}

filterButtons.forEach(button => {

  button.addEventListener("click", () => {

    filterButtons.forEach(btn =>
      btn.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });

});
