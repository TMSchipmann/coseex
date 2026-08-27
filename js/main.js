(() => {
  "use strict";

  const CONTACT_STATE_KEY = "coseex.contactWidget.open";

  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const widget = document.querySelector("[data-contact-widget]");
  const contactPanel = document.querySelector("[data-contact-panel]");
  const contactToggle = document.querySelector("[data-contact-toggle]");
  const contactClose = document.querySelector("[data-contact-close]");
  const form = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  const safeStorage = {
    get(key) {
      try { return window.localStorage.getItem(key); }
      catch { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); }
      catch { /* La interfaz sigue funcionando aunque storage no esté disponible. */ }
    }
  };

  const contactState = {
    isOpen: safeStorage.get(CONTACT_STATE_KEY) === "true",
    setOpen(nextValue) {
      this.isOpen = Boolean(nextValue);
      widget?.classList.toggle("is-open", this.isOpen);
      contactToggle?.setAttribute("aria-expanded", String(this.isOpen));
      contactPanel?.setAttribute("aria-hidden", String(!this.isOpen));
      safeStorage.set(CONTACT_STATE_KEY, String(this.isOpen));
    },
    toggle() { this.setOpen(!this.isOpen); }
  };

  contactState.setOpen(contactState.isOpen);

  contactToggle?.addEventListener("click", () => contactState.toggle());
  contactClose?.addEventListener("click", () => contactState.setOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      contactState.setOpen(false);
      closeMenu();
    }
  });

  function closeMenu() {
    menu?.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-open");
  }

  menuToggle?.addEventListener("click", () => {
    const willOpen = !menu?.classList.contains("is-open");
    menu?.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Cerrar menú" : "Abrir menú");
    document.body.classList.toggle("menu-open", willOpen);
  });

  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  document.querySelectorAll("[data-reveal]").forEach((element) => revealObserver.observe(element));

  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-42% 0px -50%", threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));

  document.querySelectorAll("[data-faq-list] details").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      document.querySelectorAll("[data-faq-list] details").forEach((otherItem) => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = Object.fromEntries(new FormData(form).entries());
    const subject = encodeURIComponent(`Solicitud web Coseex - ${values.empresa}`);
    const body = encodeURIComponent([
      `Nombre: ${values.nombre}`,
      `Empresa: ${values.empresa}`,
      `Teléfono: ${values.telefono}`,
      "",
      "Requerimiento:",
      values.requerimiento
    ].join("\n"));

    formStatus.textContent = "Abriendo tu aplicación de correo para completar el envío...";
    window.location.href = `mailto:contacto@coseex.cl?subject=${subject}&body=${body}`;
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
