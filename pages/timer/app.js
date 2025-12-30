const display = document.getElementById("display");
const minInput = document.getElementById("minInput");
const secInput = document.getElementById("secInput");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const hint = document.getElementById("hint");

let remaining = getInputSeconds();
let timerId = null;
let running = false;

updateDisplay(remaining);
setButtons();

startBtn.addEventListener("click", start);
pauseBtn.addEventListener("click", pause);
resetBtn.addEventListener("click", reset);

[minInput, secInput].forEach((el) => {
  el.addEventListener("change", () => {
    if (running) return;
    remaining = getInputSeconds();
    updateDisplay(remaining);
  });
});

function getInputSeconds() {
  const m = clampInt(minInput.value, 0, 999);
  const s = clampInt(secInput.value, 0, 59);
  minInput.value = m;
  secInput.value = s;
  return m * 60 + s;
}
function clampInt(val, min, max) {
  const n = Number(val);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, Math.floor(n)));
}
function format(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
function updateDisplay(sec) {
  display.textContent = format(Math.max(0, sec));
  document.title = `${format(Math.max(0, sec))} — Timer`;
}
function setButtons() {
  startBtn.disabled = running;
  pauseBtn.disabled = !running;
  minInput.disabled = running;
  secInput.disabled = running;
}
function start() {
  if (running) return;
  if (remaining <= 0) remaining = getInputSeconds();
  if (remaining <= 0) return;

  running = true;
  setButtons();
  hint.textContent = "Running…";

  timerId = setInterval(() => {
    remaining -= 1;
    updateDisplay(remaining);
    if (remaining <= 0) {
      stop();
      hint.textContent = "Done ✅";
      beep();
    }
  }, 1000);
}
function pause() {
  if (!running) return;
  stop();
  hint.textContent = "Paused.";
}
function reset() {
  stop();
  remaining = getInputSeconds();
  updateDisplay(remaining);
  hint.textContent = "Set time and press Start.";
}
function stop() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  running = false;
  setButtons();
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 180);
  } catch {}
}
