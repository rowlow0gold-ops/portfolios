const STORAGE_KEY = "jj_todos_v1";

const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const clearAllBtn = document.getElementById("clearAllBtn");

let todos = loadTodos();
render();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ id: Date.now(), text, done: false });
  input.value = "";
  input.focus();
  saveTodos();
  render();
});

clearAllBtn.addEventListener("click", () => {
  if (!todos.length && !input.value.trim()) return;
  if (!confirm("Clear all todos and input?")) return;

  todos = [];
  input.value = "";
  input.focus();
  saveTodos();
  render();
});

function toggle(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos();
  render();
}

function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  render();
}

function editTodo(id, newText) {
  todos = todos.map((t) => (t.id === id ? { ...t, text: newText } : t));
  saveTodos();
  render();
}

function render() {
  list.innerHTML = "";
  clearAllBtn.disabled = todos.length === 0 && !input.value.trim();

  for (const t of todos) {
    const li = document.createElement("li");
    li.className = "item";

    const span = document.createElement("span");
    span.className = "text" + (t.done ? " done" : "");
    span.textContent = t.text;
    span.addEventListener("click", () => toggle(t.id));

    span.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.className = "input";
      editInput.value = t.text;

      li.replaceChild(editInput, span);
      editInput.focus();
      editInput.setSelectionRange(
        editInput.value.length,
        editInput.value.length
      );

      function finish() {
        const value = editInput.value.trim();
        if (value) editTodo(t.id, value);
        else removeTodo(t.id);
      }

      editInput.addEventListener("blur", finish);
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") editInput.blur();
        if (e.key === "Escape") render();
      });
    });

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "Delete";
    del.addEventListener("click", () => removeTodo(t.id));

    li.appendChild(span);
    li.appendChild(del);
    list.appendChild(li);
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
