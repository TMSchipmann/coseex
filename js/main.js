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
  const formSubmit = form?.querySelector('button[type="submit"]');

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

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || formSubmit?.disabled) return;

    const values = Object.fromEntries(new FormData(form).entries());
    if (values._honey) return;
    if (![values.nombre, values.empresa, values.telefono, values.requerimiento].every((value) => value.trim())) {
      formStatus.dataset.state = "error";
      formStatus.textContent = "Completa todos los campos antes de enviar la solicitud.";
      return;
    }

    formSubmit.disabled = true;
    formStatus.dataset.state = "pending";
    formStatus.textContent = "Enviando tu solicitud...";

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(form.dataset.submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Solicitud web Coseex - ${values.empresa.trim()}`,
          _honey: values._honey,
          Nombre: values.nombre.trim(),
          Empresa: values.empresa.trim(),
          Teléfono: values.telefono.trim(),
          Requerimiento: values.requerimiento.trim()
        }),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) {
        throw new Error("El servicio de formularios no confirmó el envío.");
      }

      form.reset();
      formStatus.dataset.state = "success";
      formStatus.textContent = "Solicitud recibida. Te contactaremos pronto.";
    } catch {
      formStatus.dataset.state = "error";
      formStatus.textContent = "No pudimos enviar la solicitud. Inténtalo de nuevo o escríbenos a contacto@coseex.cl.";
    } finally {
      window.clearTimeout(timeout);
      formSubmit.disabled = false;
    }
  });

  const year = document.querySelector("[data-current-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
