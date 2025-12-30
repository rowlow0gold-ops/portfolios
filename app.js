const view = document.getElementById("view");
document.getElementById("year").textContent = new Date().getFullYear();

const routes = {
  "/home": {
    html: "pages/home/index.html",
    css: "pages/home/styles.css",
    js: "pages/home/app.js",
    active: "home",
  },
  "/apps": {
    html: "pages/apps/index.html",
    css: "pages/apps/styles.css",
    js: "pages/apps/app.js",
  },
  "/todos": {
    html: "pages/todos/index.html",
    css: "pages/todos/styles.css",
    js: "pages/todos/app.js",
    active: "apps",
  },
  "/timer": {
    html: "pages/timer/index.html",
    css: "pages/timer/styles.css",
    js: "pages/timer/app.js",
    active: "apps",
  },
};

let pageCssEl = null;
let navToken = 0;

function getPath() {
  const hash = location.hash || "#/home";
  const path = hash.replace("#", "");
  return routes[path] ? path : "/home";
}

function setActiveNav(path) {
  document.querySelectorAll(".nav__link").forEach((a) => {
    a.classList.toggle("is-active", a.getAttribute("href") === `#${path}`);
  });
}

async function loadPage(path) {
  const myToken = ++navToken;
  const route = routes[path];

  setActiveNav(path);

  // 1) Load HTML
  const htmlRes = await fetch(route.html, { cache: "no-cache" });
  const html = await htmlRes.text();
  if (myToken !== navToken) return; // stale navigation
  view.innerHTML = html;

  // 2) Swap CSS
  if (pageCssEl) pageCssEl.remove();
  pageCssEl = document.createElement("link");
  pageCssEl.id = "page-css";
  pageCssEl.rel = "stylesheet";
  pageCssEl.href = route.css + `?v=${Date.now()}`; // dev-friendly (avoid stale css)
  document.head.appendChild(pageCssEl);

  // 3) Load & run page JS (SAFE + ORDERED)
  const jsRes = await fetch(route.js, { cache: "no-cache" });
  const jsCode = await jsRes.text();
  if (myToken !== navToken) return;

  // Run inside its own function scope so "const" doesn't collide across pages
  const run = new Function(jsCode);
  run();
}

function navigate() {
  loadPage(getPath()).catch((err) => {
    view.innerHTML = `
      <div style="padding:16px;border:1px solid rgba(255,255,255,0.14);border-radius:16px;background:rgba(255,255,255,0.06)">
        <b>Failed to load page.</b>
        <div style="opacity:.7;margin-top:6px">${String(err)}</div>
      </div>
    `;
  });
}

window.addEventListener("hashchange", navigate);
navigate();
