// Brief intro loader: keep it short and avoid trapping users on slow connections.
const introLoader = document.getElementById("introLoader");
document.body.classList.add("loading");

function dismissIntroLoader() {
  if (!introLoader || introLoader.classList.contains("is-leaving")) return;
  introLoader.classList.add("is-leaving");
  document.body.classList.remove("loading");
  window.setTimeout(() => introLoader.remove(), 750);
}

// Let the brand animation breathe, but never wait indefinitely for remote images.
window.addEventListener("load", () => window.setTimeout(dismissIntroLoader, 950), { once: true });
window.setTimeout(dismissIntroLoader, 2200);

// Saffron & Stone — navigation, menu filtering, scroll reveals and enquiry handling
// Replace with the business's WhatsApp number in international format, digits only.
const WHATSAPP_NUMBER = "919876543210"; // DEMO NUMBER — update before publishing

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    });
  });
}

// Animated reveal when sections enter the viewport.
const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("in-view"));
}

// Filter menu cards by category.
const menuTabs = document.querySelectorAll(".menu-tab");
const menuCards = document.querySelectorAll(".menu-card");

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;
    menuTabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("active", active);
      item.setAttribute("aria-selected", String(active));
    });

    menuCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show) {
        card.classList.remove("in-view");
        requestAnimationFrame(() => card.classList.add("in-view"));
      }
    });
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

const whatsappLink = document.getElementById("whatsappLink");
whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Saffron & Stone! I'd like to ask about your menu.")}`;

const enquiryForm = document.getElementById("enquiryForm");
const formFeedback = document.getElementById("formFeedback");

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.checkValidity()) {
    enquiryForm.reportValidity();
    return;
  }

  const data = new FormData(enquiryForm);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const type = String(data.get("type") || "").trim();
  const details = String(data.get("details") || "").trim();

  const message = [
    "Hi Saffron & Stone! I have an enquiry.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Enquiry type: ${type}`,
    details ? `Details: ${details}` : ""
  ].filter(Boolean).join("\n");

  formFeedback.textContent = "Opening WhatsApp with your enquiry. Review the message and press Send to submit it.";
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});
