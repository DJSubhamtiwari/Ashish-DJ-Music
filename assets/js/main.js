(() => {
  "use strict";
  const cfg = window.SITE_CONFIG || {};
  const toggle = document.querySelector(".menu");
  const links = document.querySelector(".links");
  if (toggle && links) toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  const form = document.getElementById("bookingForm");
  if (!form) return;
  const status = document.getElementById("formStatus");
  const dateInput = form.querySelector('[name="date"]');
  if (dateInput) {
    const today = new Date();
    const local = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = local;
  }
  const setStatus = (message, type = "info") => {
    status.textContent = message;
    status.dataset.type = type;
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const digits = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    if (!/^91[6-9]\d{9}$/.test(digits)) {
      setStatus("Website owner: please add a valid WhatsApp number in assets/js/config.js before accepting bookings.", "error");
      return;
    }
    const message = [
      "Hello Ashish DJ Music! I would like to enquire about a booking.",
      "",
      "Name: " + data.name,
      "Service: " + data.service,
      "Event Date: " + data.date,
      "Event Time: " + data.time,
      "Phone: " + data.phone,
      data.notes ? "Details: " + data.notes : ""
    ].filter(Boolean).join("\n");
    const whatsappUrl = "https://wa.me/" + digits + "?text=" + encodeURIComponent(message);
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!popup) window.location.href = whatsappUrl;

    setStatus("Opening WhatsApp. Please press Send there to submit your enquiry.", "success");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setStatus("Booking details saved. WhatsApp is ready—please press Send to contact Ashish.", "success");
      } else {
        const result = await response.json().catch(() => ({}));
        setStatus((result.error || "WhatsApp is ready. The database is not configured yet.") + " Please press Send in WhatsApp.", "warning");
      }
    } catch (error) {
      setStatus("WhatsApp is ready. Database saving is unavailable until hosting is configured. Please press Send.", "warning");
    }
    form.reset();
    if (dateInput) dateInput.min = dateInput.min;
  });
})();