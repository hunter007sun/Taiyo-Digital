
"use strict";

/* =========================================
   NEXORA DIGITAL
   Interactive website functionality
   ========================================= */

/* 1. Mobile navigation */

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  navLinks.classList.remove("is-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isExpanded =
      menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu"
    );

    navLinks.classList.toggle("is-open", !isExpanded);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

/* 2. Automatic footer year */

const currentYear = document.querySelector("#current-year");

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

/* 3. Contact form validation and inquiry preparation */

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

if (contactForm && formStatus) {
  const nameInput = document.querySelector("#name");
  const emailInput = document.querySelector("#email");
  const serviceInput = document.querySelector("#service");
  const messageInput = document.querySelector("#message");
  const submitButton = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    formStatus.textContent = "";

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const service = serviceInput.value;
    const message = messageInput.value.trim();

    if (name.length < 2) {
      nameInput.setCustomValidity(
        "Please enter a name with at least two characters."
      );
      nameInput.reportValidity();
      nameInput.setCustomValidity("");
      return;
    }

    if (message.length < 10) {
      messageInput.setCustomValidity(
        "Please describe your project in at least 10 characters."
      );
      messageInput.reportValidity();
      messageInput.setCustomValidity("");
      return;
    }

    const serviceLabels = {
      website: "Website development",
      software: "Custom business software",
      saas: "SaaS or automation",
      other: "Something else",
    };

    const inquiry = [
      "NEXORA DIGITAL — PROJECT INQUIRY",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Service: ${serviceLabels[service] || service}`,
      "",
      "Project description:",
      message,
    ].join("\n");

    formStatus.textContent =
      "Your inquiry is ready. Choose Copy inquiry to copy it.";

    formStatus.style.color = "#9eb1ff";

    let copyButton = contactForm.querySelector(".copy-inquiry-button");

    if (!copyButton) {
      copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className =
        "button button-secondary copy-inquiry-button form-submit";
      copyButton.style.marginTop = "12px";
      copyButton.textContent = "Copy inquiry";

      submitButton.insertAdjacentElement("afterend", copyButton);
    }

    copyButton.onclick = async () => {
      try {
        await navigator.clipboard.writeText(inquiry);

        copyButton.textContent = "Inquiry copied!";
        formStatus.textContent =
          "Copied successfully. You can now paste the inquiry into an email.";

      } catch {
        const temporaryTextArea = document.createElement("textarea");

        temporaryTextArea.value = inquiry;
        temporaryTextArea.setAttribute("readonly", "");
        temporaryTextArea.style.position = "fixed";
        temporaryTextArea.style.opacity = "0";

        document.body.appendChild(temporaryTextArea);
        temporaryTextArea.select();

        const copied = document.execCommand("copy");

        temporaryTextArea.remove();

        if (copied) {
          copyButton.textContent = "Inquiry copied!";
          formStatus.textContent =
            "Copied successfully. You can now paste the inquiry into an email.";
        } else {
          formStatus.textContent =
            "Automatic copying failed. Please try again in a modern browser.";
        }
      }
    };
  });

  contactForm.addEventListener("input", () => {
    formStatus.textContent = "";
  });
}
