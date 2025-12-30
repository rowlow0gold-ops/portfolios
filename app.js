const view = document.getElementById("view");
document.getElementById("year").textContent = new Date().getFullYear();

const routes = {
  "/home": {
    html: "pages/home/index.html",
    css: "pages/home/styles.css",
    js: "pages/home/app.js",
    group: "home",
  },
  "/todos": {
    html: "pages/todos/index.html",
    css: "pages/todos/styles.css",
    js: "pages/todos/app.js",
    group: "todos",
  },
  "/timer": {
    html: "pages/timer/index.html",
    css: "pages/timer/styles.css",
    js: "pages/timer/app.js",
    group: "apps",
  },
};

let currentCssEl = null;
let currentJsEl = null;

function getPath() {
  const hash = location.hash || "#/home";
  const path = hash.replace("#", "");
  return routes[path] ? path : "/home";
}

function setActiveTabs(path) {
  const route = routes[path];
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("is-active", el.dataset.route === route.group);
  });
}

async function loadPage(path) {
  const route = routes[path];
  setActiveTabs(path);

  // Load HTML
  const res = await fetch(route.html);
  view.innerHTML = await res.text();

  // Swap CSS
  if (currentCssEl) currentCssEl.remove();
  currentCssEl = document.createElement("link");
  currentCssEl.rel = "stylesheet";
  currentCssEl.href = route.css;
  document.head.appendChild(currentCssEl);

  // Swap JS
  if (currentJsEl) currentJsEl.remove();
  currentJsEl = document.createElement("script");
  currentJsEl.src = route.js;
  currentJsEl.defer = true;
  document.body.appendChild(currentJsEl);
}

function navigate() {
  loadPage(getPath()).catch((err) => {
    view.innerHTML = `<div style="padding:16px;border:1px solid rgba(255,255,255,0.14);border-radius:16px;background:rgba(255,255,255,0.06)">
      <b>Failed to load page.</b><div style="opacity:.7;margin-top:6px">${String(
        err
      )}</div></div>`;
  });
}

window.addEventListener("hashchange", navigate);
navigate();
