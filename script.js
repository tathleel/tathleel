const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const toast = document.querySelector("[data-toast]");

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

function setMenu(open) {
  if (!menuToggle || !mobileNav || !header) return;

  document.body.classList.toggle("menu-open", open);
  mobileNav.classList.toggle("is-open", open);
  header.classList.toggle("menu-active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuToggle.innerHTML = `<i data-lucide="${open ? "x" : "menu"}"></i>`;
  refreshIcons();
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3200);
}

function setupReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      showToast("Please complete all fields before sending.");
      return;
    }

    form.reset();
    showToast("Message prepared. We will get back to you soon.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  refreshIcons();
  setHeaderState();
  setupReveal();
  setupContactForm();

  window.addEventListener("scroll", setHeaderState, { passive: true });

  menuToggle?.addEventListener("click", () => {
    setMenu(!mobileNav?.classList.contains("is-open"));
  });

  mobileNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
});

window.addEventListener("load", refreshIcons);
