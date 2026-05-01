const STORAGE_KEY = "nova.theme";

function setTheme(theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return getSystemTheme();
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  const next = current === "light" ? "dark" : "light";
  localStorage.setItem(STORAGE_KEY, next);
  setTheme(next);
}

function initThemeToggle() {
  setTheme(getInitialTheme());
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.addEventListener("click", toggleTheme);
}

function initHeaderElevation() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  const update = () => header.setAttribute("data-elevated", String(window.scrollY > 8));
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mobileNav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.hidden = true;
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    nav.hidden = false;
    toggle.setAttribute("aria-label", "Close menu");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    if (nav.hidden) open();
    else close();
  });

  nav.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a") : null;
    if (a) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function initLeadForm() {
  const form = document.getElementById("leadForm");
  const hint = document.getElementById("formHint");
  const email = document.getElementById("email");
  if (!form || !hint || !email) return;

  const setHint = (message, type) => {
    hint.textContent = message;
    hint.classList.toggle("error", type === "error");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = String(email.value || "").trim();

    if (!value) return setHint("Please enter your email.", "error");
    if (!isValidEmail(value)) return setHint("That email doesn’t look right.", "error");

    setHint("Thanks — you’re on the list.", "success");
    form.reset();
  });
}

initThemeToggle();
initHeaderElevation();
initMobileMenu();
initLeadForm();

