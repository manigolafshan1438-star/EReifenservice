/* =========================================================
   REIFENSERVICE HEIDELBERG
   Complete Frontend Script
   Booking + Calendar + Time Slots + Backend + WhatsApp
   ========================================================= */

   (function () {
    "use strict";
  
    /* =========================
       SETTINGS
    ========================= */
  
    const API_URL = "https://ereifenservice.onrender.com";
    const WHATSAPP_NUMBER = "4917663047915";
  
    const BUSINESS_HOURS = {
      0: [], // Sunday closed
      1: createTimeSlots("08:00", "18:30", 30),
      2: createTimeSlots("08:00", "18:30", 30),
      3: createTimeSlots("08:00", "18:30", 30),
      4: createTimeSlots("08:00", "18:30", 30),
      5: createTimeSlots("08:00", "18:30", 30),
      6: createTimeSlots("08:00", "18:00", 30)
    };
  
    function createTimeSlots(start, end, interval) {
      const slots = [];
  
      let [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
  
      let current = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
  
      while (current <= endMinutes) {
        const h = String(Math.floor(current / 60)).padStart(2, "0");
        const m = String(current % 60).padStart(2, "0");
  
        slots.push(`${h}:${m}`);
        current += interval;
      }
  
      return slots;
    }
  
    /* =========================
       MOBILE MENU
    ========================= */
  
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");
  
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
      });
  
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
  
    /* =========================
       CONTACT FORM
    ========================= */
  
    const kontaktForm = document.getElementById("kontaktForm");
  
    if (kontaktForm) {
      kontaktForm.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const name = getValue("name");
        const tel = getValue("tel");
        const fahrzeug = getValue("fahrzeug");
        const datum = getValue("datum");
        const leistung = getValue("leistung");
        const msg = getValue("msg");
  
        const lines = [
          "Name: " + name,
          "Telefon: " + tel,
          "Fahrzeug: " + fahrzeug,
          "Wunschtermin: " + datum,
          "Leistung: " + leistung,
          "",
          "Nachricht:",
          msg
        ];
  
        const subject =
          "Terminanfrage Reifenservice Heidelberg - " +
          (leistung || "Service");
  
        window.location.href =
          "mailto:info@autoverkaufen-bw.de?subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(lines.join("\n"));
      });
    }
  
    function getValue(name) {
      const element = document.querySelector(`[name="${name}"]`);
      return element ? element.value.trim() : "";
    }
  
    /* =========================
       BOOKING MODAL CSS
    ========================= */
  
    injectBookingStyles();
  
    /* =========================
       BOOKING MODAL
    ========================= */
  
    let bookingModal = null;
    let selectedDate = null;
    let selectedTime = null;
    let currentMonth = new Date();
  
    function createBookingModal() {
      if (bookingModal) return;
  
      bookingModal = document.createElement("div");
      bookingModal.id = "bookingModal";
  
      bookingModal.innerHTML = `
        <div class="booking-overlay">
          <div class="booking-card">
  
            <button
              type="button"
              class="booking-close"
              id="bookingClose"
              aria-label="SchlieÃŸen"
            >
              Ã—
            </button>
  
            <div class="booking-header">
              <div class="booking-icon">âœ“</div>
              <div>
                <div class="booking-eyebrow">REIFENSERVICE HEIDELBERG</div>
                <h2>Termin buchen</h2>
                <p>WÃ¤hlen Sie Ihren Wunschtermin bequem online.</p>
              </div>
            </div>
  
            <form id="bookingForm">
  
              <div class="booking-grid">
  
                <div class="booking-field">
                  <label for="bookingName">Name *</label>
                  <input
                    id="bookingName"
                    name="bookingName"
                    type="text"
                    placeholder="Ihr Name"
                    required
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingPhone">Telefon *</label>
                  <input
                    id="bookingPhone"
                    name="bookingPhone"
                    type="tel"
                    placeholder="+49 ..."
                    required
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingVehicle">Fahrzeug</label>
                  <input
                    id="bookingVehicle"
                    name="bookingVehicle"
                    type="text"
                    placeholder="z. B. BMW 3er"
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingService">Leistung *</label>
  
                  <select
                    id="bookingService"
                    name="bookingService"
                    required
                  >
                    <option value="">Bitte auswÃ¤hlen</option>
                    <option value="Reifenwechsel">Reifenwechsel</option>
                    <option value="Reifenmontage">Reifenmontage</option>
                    <option value="Auswuchten">Auswuchten</option>
                    <option value="Reifenverkauf">Reifenverkauf</option>
                    <option value="Reifenwechsel + Auswuchten">
                      Reifenwechsel + Auswuchten
                    </option>
                    <option value="Sonstige Anfrage">
                      Sonstige Anfrage
                    </option>
                  </select>
                </div>
  
              </div>
  
              <div class="booking-section">
  
                <div class="booking-section-title">
                  <span>1</span>
                  <div>
                    <strong>Datum auswÃ¤hlen</strong>
                    <small>Sonntag geschlossen</small>
                  </div>
                </div>
  
                <div class="calendar">
  
                  <div class="calendar-head">
                    <button
                      type="button"
                      id="prevMonth"
                      class="calendar-arrow"
                    >
                      â€¹
                    </button>
  
                    <strong id="calendarTitle"></strong>
  
                    <button
                      type="button"
                      id="nextMonth"
                      class="calendar-arrow"
                    >
                      â€º
                    </button>
                  </div>
  
                  <div class="calendar-weekdays">
                    <span>Mo</span>
                    <span>Di</span>
                    <span>Mi</span>
                    <span>Do</span>
                    <span>Fr</span>
                    <span>Sa</span>
                    <span>So</span>
                  </div>
  
                  <div
                    class="calendar-days"
                    id="calendarDays"
                  ></div>
  
                </div>
  
              </div>
  
              <div class="booking-section">
  
                <div class="booking-section-title">
                  <span>2</span>
                  <div>
                    <strong>Uhrzeit auswÃ¤hlen</strong>
                    <small id="timeHint">
                      Zuerst ein Datum auswÃ¤hlen
                    </small>
                  </div>
                </div>
  
                <div
                  class="time-grid"
                  id="timeGrid"
                >
                  <div class="time-empty">
                    Bitte zuerst ein Datum auswÃ¤hlen.
                  </div>
                </div>
  
              </div>
  
              <div class="booking-field booking-message">
  
                <label for="bookingMessage">
                  Nachricht
                </label>
  
                <textarea
                  id="bookingMessage"
                  name="bookingMessage"
                  rows="4"
                  placeholder="Optional: weitere Informationen zu Ihrem Fahrzeug oder Termin..."
                ></textarea>
  
              </div>
  
              <div
                class="booking-summary"
                id="bookingSummary"
              >
                <div class="summary-title">
                  Ihre Terminanfrage
                </div>
  
                <div class="summary-row">
                  <span>Datum</span>
                  <strong id="summaryDate">â€“</strong>
                </div>
  
                <div class="summary-row">
                  <span>Uhrzeit</span>
                  <strong id="summaryTime">â€“</strong>
                </div>
  
                <div class="summary-row">
                  <span>Leistung</span>
                  <strong id="summaryService">â€“</strong>
                </div>
              </div>
  
              <div
                class="booking-error"
                id="bookingError"
              ></div>
  
              <button
                type="submit"
                class="booking-submit"
                id="bookingSubmit"
              >
                <span>Termin anfragen</span>
                <span>â†’</span>
              </button>
  
              <p class="booking-note">
                Mit dem Absenden wird Ihre Terminanfrage gespeichert.
                Die endgÃ¼ltige TerminbestÃ¤tigung erfolgt durch den Betrieb.
              </p>
  
            </form>
  
          </div>
        </div>
      `;
  
      document.body.appendChild(bookingModal);
  
      setupBookingEvents();
      renderCalendar();
    }
  
    /* =========================
       BOOKING EVENTS
    ========================= */
  
    function setupBookingEvents() {
      const close = document.getElementById("bookingClose");
      const prev = document.getElementById("prevMonth");
      const next = document.getElementById("nextMonth");
      const form = document.getElementById("bookingForm");
  
      if (close) {
        close.addEventListener("click", closeBooking);
      }
  
      if (prev) {
        prev.addEventListener("click", function () {
          currentMonth.setMonth(currentMonth.getMonth() - 1);
          renderCalendar();
        });
      }
  
      if (next) {
        next.addEventListener("click", function () {
          currentMonth.setMonth(currentMonth.getMonth() + 1);
          renderCalendar();
        });
      }
  
      if (form) {
        form.addEventListener("submit", submitBooking);
      }
  
      bookingModal.addEventListener("click", function (event) {
        if (event.target.classList.contains("booking-overlay")) {
          closeBooking();
        }
      });
    }
  
    /* =========================
       OPEN / CLOSE BOOKING
    ========================= */
  
    function openBooking() {
      createBookingModal();
  
      selectedDate = null;
      selectedTime = null;
  
      currentMonth = new Date();
  
      currentMonth.setDate(1);
  
      document.body.style.overflow = "hidden";
  
      bookingModal.classList.add("show");
  
      renderCalendar();
      renderTimes();
  
      setTimeout(function () {
        const first = document.getElementById("bookingName");
  
        if (first) {
          first.focus();
        }
      }, 100);
    }
  
    function closeBooking() {
      if (!bookingModal) return;
  
      bookingModal.classList.remove("show");
  
      document.body.style.overflow = "";
    }
  
    /* =========================
       BOOKING BUTTONS
    ========================= */
  
    document.addEventListener("click", function (event) {
      const button = event.target.closest(
        '[data-termin], .mobile-bar .cal, .mbar .sq, a[href="#kontakt"]'
      );
  
      if (!button) return;
  
      const href = button.getAttribute("href");
  
      /*
        Only intercept #kontakt links that are clearly
        appointment / booking buttons.
      */
  
      const text = (
        button.textContent ||
        ""
      ).toLowerCase();
  
      const isBookingButton =
        button.hasAttribute("data-termin") ||
        button.classList.contains("cal") ||
        button.classList.contains("sq") ||
        text.includes("termin") ||
        text.includes("beratung");
  
      if (
        href === "#kontakt" &&
        !button.hasAttribute("data-termin") &&
        !button.classList.contains("cal") &&
        !button.classList.contains("sq") &&
        !isBookingButton
      ) {
        return;
      }
  
      if (
        button.hasAttribute("data-termin") ||
        button.classList.contains("cal") ||
        button.classList.contains("sq") ||
        text.includes("termin vereinbaren") ||
        text.includes("termin buchen") ||
        text.includes("beratung erhalten")
      ) {
        event.preventDefault();
  
        openBooking();
      }
    });
  
    /* =========================
       CALENDAR
    ========================= */
  
    function renderCalendar() {
      const title = document.getElementById("calendarTitle");
      const container = document.getElementById("calendarDays");
  
      if (!title || !container) return;
  
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
  
      const monthName = new Intl.DateTimeFormat(
        "de-DE",
        {
          month: "long",
          year: "numeric"
        }
      ).format(currentMonth);
  
      title.textContent =
        monthName.charAt(0).toUpperCase() +
        monthName.slice(1);
  
      container.innerHTML = "";
  
      const firstDay = new Date(year, month, 1);
  
      let weekday = firstDay.getDay();
  
      /*
        JS:
        Sunday = 0
        Monday = 1
  
        Convert to:
        Monday = 0
        Sunday = 6
      */
  
      weekday = weekday === 0 ? 6 : weekday - 1;
  
      for (let i = 0; i < weekday; i++) {
        const empty = document.createElement("span");
        empty.className = "calendar-empty";
        container.appendChild(empty);
      }
  
      const daysInMonth = new Date(
        year,
        month + 1,
        0
      ).getDate();
  
      const today = new Date();
  
      today.setHours(0, 0, 0, 0);
  
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
  
        date.setHours(0, 0, 0, 0);
  
        const button = document.createElement("button");
  
        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;
  
        const dateString = formatDateISO(date);
  
        button.dataset.date = dateString;
  
        const isSunday = date.getDay() === 0;
        const isPast = date < today;
  
        if (isSunday || isPast) {
          button.disabled = true;
          button.classList.add("disabled");
        }
  
        if (
          date.getTime() === today.getTime()
        ) {
          button.classList.add("today");
        }
  
        if (
          selectedDate === dateString
        ) {
          button.classList.add("selected");
        }
  
        button.addEventListener(
          "click",
          function () {
            selectDate(dateString);
          }
        );
  
        container.appendChild(button);
      }
    }
  
    function selectDate(dateString) {
      selectedDate = dateString;
      selectedTime = null;
  
      renderCalendar();
      renderTimes();
      updateSummary();
    }
  
    /* =========================
       TIME SLOTS
    ========================= */
  
    function renderTimes() {
      const grid = document.getElementById("timeGrid");
      const hint = document.getElementById("timeHint");
  
      if (!grid) return;
  
      grid.innerHTML = "";
  
      if (!selectedDate) {
        grid.innerHTML = `
          <div class="time-empty">
            Bitte zuerst ein Datum auswÃ¤hlen.
          </div>
        `;
  
        if (hint) {
          hint.textContent =
            "Zuerst ein Datum auswÃ¤hlen";
        }
  
        return;
      }
  
      const date = parseDateISO(selectedDate);
  
      const day = date.getDay();
  
      const slots = BUSINESS_HOURS[day] || [];
  
      if (slots.length === 0) {
        grid.innerHTML = `
          <div class="time-empty">
            An diesem Tag ist der Betrieb geschlossen.
          </div>
        `;
  
        return;
      }
  
      if (hint) {
        hint.textContent =
          day === 6
            ? "Samstag: 08:00â€“18:00 Uhr"
            : "Montagâ€“Freitag: 08:00â€“18:30 Uhr";
      }
  
      slots.forEach(function (time) {
        const button = document.createElement("button");
  
        button.type = "button";
        button.className = "time-button";
  
        button.textContent = time;
  
        if (selectedTime === time) {
          button.classList.add("selected");
        }
  
        button.addEventListener(
          "click",
          function () {
            selectedTime = time;
  
            document
              .querySelectorAll(".time-button")
              .forEach(function (item) {
                item.classList.remove("selected");
              });
  
            button.classList.add("selected");
  
            updateSummary();
          }
        );
  
        grid.appendChild(button);
      });
    }
  
    /* =========================
       SUMMARY
    ========================= */
  
    function updateSummary() {
      const dateElement =
        document.getElementById("summaryDate");
  
      const timeElement =
        document.getElementById("summaryTime");
  
      const serviceElement =
        document.getElementById("summaryService");
  
      if (dateElement) {
        dateElement.textContent =
          selectedDate
            ? formatGermanDate(selectedDate)
            : "â€“";
      }
  
      if (timeElement) {
        timeElement.textContent =
          selectedTime
            ? selectedTime + " Uhr"
            : "â€“";
      }
  
      const service =
        document.getElementById("bookingService");
  
      if (serviceElement) {
        serviceElement.textContent =
          service && service.value
            ? service.value
            : "â€“";
      }
    }
  
    document.addEventListener("change", function (event) {
      if (
        event.target &&
        event.target.id === "bookingService"
      ) {
        updateSummary();
      }
    });
  
    /* =========================
       SUBMIT BOOKING
    ========================= */
  
    async function submitBooking(event) {
      event.preventDefault();
  
      const errorBox =
        document.getElementById("bookingError");
  
      const submitButton =
        document.getElementById("bookingSubmit");
  
      if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.remove("show");
      }
  
      const name =
        document.getElementById("bookingName")?.value.trim();
  
      const phone =
        document.getElementById("bookingPhone")?.value.trim();
  
      const vehicle =
        document.getElementById("bookingVehicle")?.value.trim();
  
      const service =
        document.getElementById("bookingService")?.value.trim();
  
      const message =
        document.getElementById("bookingMessage")?.value.trim();
  
      if (!name || !phone || !service) {
        showBookingError(
          "Bitte fÃ¼llen Sie Name, Telefon und Leistung aus."
        );
  
        return;
      }
  
      if (!selectedDate) {
        showBookingError(
          "Bitte wÃ¤hlen Sie ein Datum aus."
        );
  
        return;
      }
  
      if (!selectedTime) {
        showBookingError(
          "Bitte wÃ¤hlen Sie eine Uhrzeit aus."
        );
  
        return;
      }
  
      const selected = parseDateISO(selectedDate);
  
      if (selected.getDay() === 0) {
        showBookingError(
          "Sonntag ist geschlossen. Bitte wÃ¤hlen Sie einen anderen Tag."
        );
  
        return;
      }
  
      if (submitButton) {
        submitButton.disabled = true;
  
        submitButton.innerHTML =
          "<span>Wird gespeichert...</span><span>...</span>";
      }
  
      const bookingData = {
        name: name,
        phone: phone,
        vehicle: vehicle,
        service: service,
        date: selectedDate,
        time: selectedTime,
        message: message
      };
  
      try {
        const response = await fetch(
          API_URL + "/api/bookings",
          {
            method: "POST",
  
            headers: {
              "Content-Type": "application/json"
            },
  
            body: JSON.stringify(bookingData)
          }
        );
  
        let data = null;
  
        try {
          data = await response.json();
        } catch (jsonError) {
          data = null;
        }
  
        if (!response.ok) {
          throw new Error(
            data?.message ||
            "Die Terminanfrage konnte nicht gespeichert werden."
          );
        }
  
        const trackingCode =
          data?.trackingCode ||
          data?.booking?.trackingCode ||
          "RH-" +
            Math.random()
              .toString(36)
              .substring(2, 8)
              .toUpperCase();
  
        closeBooking();
  
        showSuccessModal(
          bookingData,
          trackingCode
        );
  
      } catch (error) {
        console.error(
          "Booking error:",
          error
        );
  
        showBookingError(
          "Die Verbindung zum Buchungssystem konnte nicht hergestellt werden. Bitte prÃ¼fen Sie, ob der Server lÃ¤uft."
        );
  
        if (submitButton) {
          submitButton.disabled = false;
  
          submitButton.innerHTML =
            "<span>Termin anfragen</span><span>â†’</span>";
        }
      }
    }
  
    function showBookingError(message) {
      const errorBox =
        document.getElementById("bookingError");
  
      if (!errorBox) return;
  
      errorBox.textContent = message;
  
      errorBox.classList.add("show");
    }
  
    /* =========================
       SUCCESS MODAL
    ========================= */
  
    function showSuccessModal(
      booking,
      trackingCode
    ) {
      const old =
        document.getElementById(
          "bookingSuccessModal"
        );
  
      if (old) {
        old.remove();
      }
  
      const modal =
        document.createElement("div");
  
      modal.id =
        "bookingSuccessModal";
  
      modal.innerHTML = `
        <div class="success-overlay">
  
          <div class="success-card">
  
            <button
              type="button"
              class="success-close"
              id="successClose"
              aria-label="SchlieÃŸen"
            >
              Ã—
            </button>
  
            <div class="success-check">
              âœ“
            </div>
  
            <div class="success-eyebrow">
              TERMINANFRAGE ERFOLGREICH
            </div>
  
            <h2>
              Anfrage gespeichert
            </h2>
  
            <p class="success-text">
              Ihre Terminanfrage wurde erfolgreich gespeichert.
            </p>
  
            <div class="tracking-box">
  
              <span>
                IHRE BUCHUNGSNUMMER
              </span>
  
              <strong>
                ${escapeHtml(trackingCode)}
              </strong>
  
              <small>
                Bitte bewahren Sie diese Buchungsnummer fÃ¼r Ihre Anfrage auf.
              </small>
  
            </div>
  
            <div class="success-details">
  
              <div>
                <span>Name</span>
                <strong>${escapeHtml(booking.name)}</strong>
              </div>
  
              <div>
                <span>Datum</span>
                <strong>${escapeHtml(formatGermanDate(booking.date))}</strong>
              </div>
  
              <div>
                <span>Uhrzeit</span>
                <strong>${escapeHtml(booking.time)} Uhr</strong>
              </div>
  
              <div>
                <span>Leistung</span>
                <strong>${escapeHtml(booking.service)}</strong>
              </div>
  
            </div>
  
            <button
              type="button"
              class="whatsapp-button"
              id="sendWhatsApp"
            >
              <span class="whatsapp-symbol">â—‰</span>Termin per WhatsApp senden
            </button>
  
            <button
              type="button"
              class="success-secondary"
              id="successClose2"
            >
              SchlieÃŸen
            </button>
  
            <p class="success-note">
              Die WhatsApp-Nachricht wird auf Ihrem GerÃ¤t vorbereitet.
              Zum Absenden mÃ¼ssen Sie in WhatsApp noch auf â€žSendenâ€œ drÃ¼cken.
            </p>
  
          </div>
  
        </div>
      `;
  
      document.body.appendChild(modal);
  
      document.body.style.overflow = "hidden";
  
      requestAnimationFrame(function () {
        modal.classList.add("show");
      });
  
      const close1 =
        document.getElementById(
          "successClose"
        );
  
      const close2 =
        document.getElementById(
          "successClose2"
        );
  
      if (close1) {
        close1.addEventListener(
          "click",
          function () {
            closeSuccessModal();
          }
        );
      }
  
      if (close2) {
        close2.addEventListener(
          "click",
          function () {
            closeSuccessModal();
          }
        );
      }
  
      const whatsapp =
        document.getElementById(
          "sendWhatsApp"
        );
  
      if (whatsapp) {
        whatsapp.addEventListener(
          "click",
          function () {
            openWhatsApp(
              booking,
              trackingCode
            );
          }
        );
      }
  
      modal.addEventListener(
        "click",
        function (event) {
          if (
            event.target.classList.contains(
              "success-overlay"
            )
          ) {
            closeSuccessModal();
          }
        }
      );
    }
  
    function closeSuccessModal() {
      const modal =
        document.getElementById(
          "bookingSuccessModal"
        );
  
      if (modal) {
        modal.remove();
      }
  
      document.body.style.overflow = "";
    }
  
    /* =========================
       WHATSAPP
    ========================= */
  
    function openWhatsApp(
      booking,
      trackingCode
    ) {
      /*
        Deliberately no emojis here.
        This avoids the broken "ï¿½" characters
        that appeared in the previous WhatsApp test.
      */
  
      const message = [
        "Neue Terminanfrage",
        "",
        "Buchungsnummer: " + trackingCode,
        "",
        "Name: " + booking.name,
        "Telefon: " + booking.phone,
        "Fahrzeug: " + (booking.vehicle || "-"),
        "Leistung: " + booking.service,
        "",
        "Datum: " + formatGermanDate(booking.date),
        "Uhrzeit: " + booking.time + " Uhr",
        "",
        "Nachricht:",
        booking.message || "-",
        "",
        "Mit freundlichen GrÃ¼ÃŸen",
        "Reifenservice Heidelberg"
      ].join("\n");
  
      const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);
  
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    }
  
    /* =========================
       DATE HELPERS
    ========================= */
  
    function formatDateISO(date) {
      const year =
        date.getFullYear();
  
      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");
  
      const day =
        String(
          date.getDate()
        ).padStart(2, "0");
  
      return `${year}-${month}-${day}`;
    }
  
    function parseDateISO(value) {
      const parts =
        value.split("-").map(Number);
  
      return new Date(
        parts[0],
        parts[1] - 1,
        parts[2]
      );
    }
  
    function formatGermanDate(value) {
      const date =
        parseDateISO(value);
  
      return new Intl.DateTimeFormat(
        "de-DE",
        {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      ).format(date);
    }
  
    /* =========================
       HTML ESCAPE
    ========================= */
  
    function escapeHtml(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  
    /* =========================
       BOOKING CSS
    ========================= */
  
    function injectBookingStyles() {
      if (
        document.getElementById(
          "bookingScriptStyles"
        )
      ) {
        return;
      }
  
      const style =
        document.createElement("style");
  
      style.id =
        "bookingScriptStyles";
  
      style.textContent = `
        /* =========================
           BOOKING OVERLAY
        ========================= */
  
        .booking-overlay,
        .success-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, .72);
          backdrop-filter: blur(8px);
          overflow-y: auto;
        }
  
        .booking-card {
          position: relative;
          width: min(760px, 100%);
          max-height: 94vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 24px;
          padding: 30px;
          box-shadow:
            0 30px 100px rgba(0,0,0,.35);
          transform: translateY(20px);
          opacity: 0;
          transition:
            opacity .25s ease,
            transform .25s ease;
        }
  
        #bookingModal {
          position: fixed;
          inset: 0;
          z-index: 99999;
          visibility: hidden;
          opacity: 0;
          transition: opacity .2s ease;
        }
  
        #bookingModal.show {
          visibility: visible;
          opacity: 1;
        }
  
        #bookingModal.show .booking-card {
          transform: translateY(0);
          opacity: 1;
        }
  
        .booking-close,
        .success-close {
          position: absolute;
          top: 15px;
          right: 17px;
          width: 40px;
          height: 40px;
          border: 0;
          border-radius: 50%;
          background: #f1f3f5;
          color: #222;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
        }
  
        .booking-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 26px;
          padding-right: 40px;
        }
  
        .booking-icon {
          width: 54px;
          height: 54px;
          flex: 0 0 54px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #188f4d;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
        }
  
        .booking-eyebrow,
        .success-eyebrow {
          color: #188f4d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: .12em;
        }
  
        .booking-header h2 {
          margin: 3px 0;
          color: #111827;
          font-size: 30px;
        }
  
        .booking-header p {
          margin: 0;
          color: #68707d;
          font-size: 14px;
        }
  
        .booking-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
  
        .booking-field {
          margin-bottom: 16px;
        }
  
        .booking-field label {
          display: block;
          margin-bottom: 7px;
          color: #202631;
          font-size: 13px;
          font-weight: 700;
        }
  
        .booking-field input,
        .booking-field select,
        .booking-field textarea {
          box-sizing: border-box;
          width: 100%;
          border: 1px solid #d9dee5;
          border-radius: 12px;
          background: #fff;
          color: #171a1f;
          padding: 13px 14px;
          font: inherit;
          outline: none;
          transition:
            border-color .2s,
            box-shadow .2s;
        }
  
        .booking-field input:focus,
        .booking-field select:focus,
        .booking-field textarea:focus {
          border-color: #188f4d;
          box-shadow:
            0 0 0 3px rgba(24,143,77,.10);
        }
  
        .booking-field textarea {
          resize: vertical;
          min-height: 100px;
        }
  
        .booking-section {
          margin-top: 14px;
          margin-bottom: 24px;
        }
  
        .booking-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
        }
  
        .booking-section-title > span {
          width: 29px;
          height: 29px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #188f4d;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }
  
        .booking-section-title strong {
          display: block;
          color: #171a1f;
          font-size: 15px;
        }
  
        .booking-section-title small {
          display: block;
          margin-top: 2px;
          color: #78818c;
          font-size: 11px;
        }
  
        .calendar {
          border: 1px solid #e2e6eb;
          border-radius: 16px;
          padding: 14px;
        }
  
        .calendar-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }
  
        .calendar-head strong {
          color: #15191f;
          font-size: 15px;
        }
  
        .calendar-arrow {
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 10px;
          background: #f2f4f6;
          color: #1d242b;
          font-size: 23px;
          cursor: pointer;
        }
  
        .calendar-arrow:hover {
          background: #e8ecef;
        }
  
        .calendar-weekdays,
        .calendar-days {
          display: grid;
          grid-template-columns:
            repeat(7, 1fr);
          gap: 5px;
        }
  
        .calendar-weekdays {
          margin-bottom: 6px;
        }
  
        .calendar-weekdays span {
          text-align: center;
          color: #7a838d;
          font-size: 11px;
          font-weight: 800;
        }
  
        .calendar-day,
        .calendar-empty {
          min-height: 40px;
        }
  
        .calendar-day {
          border: 1px solid transparent;
          border-radius: 10px;
          background: #f7f8f9;
          color: #252b32;
          font-size: 13px;
          cursor: pointer;
        }
  
        .calendar-day:hover:not(:disabled) {
          border-color: #188f4d;
          background: #f0faf4;
        }
  
        .calendar-day.today {
          box-shadow:
            inset 0 0 0 1px #188f4d;
        }
  
        .calendar-day.selected {
          background: #188f4d;
          color: #fff;
          font-weight: 800;
        }
  
        .calendar-day:disabled {
          cursor: not-allowed;
          opacity: .28;
        }
  
        .time-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 8px;
        }
  
        .time-button {
          border: 1px solid #dfe4e9;
          border-radius: 10px;
          background: #fff;
          color: #20252b;
          padding: 11px 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
  
        .time-button:hover {
          border-color: #188f4d;
          background: #f0faf4;
        }
  
        .time-button.selected {
          border-color: #188f4d;
          background: #188f4d;
          color: #fff;
        }
  
        .time-empty {
          grid-column: 1 / -1;
          padding: 18px;
          border-radius: 12px;
          background: #f5f6f7;
          color: #747d87;
          text-align: center;
          font-size: 13px;
        }
  
        .booking-summary {
          margin-top: 20px;
          padding: 17px;
          border-radius: 15px;
          background: #f5f7f8;
        }
  
        .summary-title {
          margin-bottom: 10px;
          color: #161a1e;
          font-size: 13px;
          font-weight: 800;
        }
  
        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 6px 0;
          border-bottom: 1px solid #e2e5e8;
          font-size: 13px;
        }
  
        .summary-row:last-child {
          border-bottom: 0;
        }
  
        .summary-row span {
          color: #737c86;
        }
  
        .summary-row strong {
          color: #1d2329;
          text-align: right;
        }
  
        .booking-error {
          display: none;
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 11px;
          background: #fff0f0;
          color: #b42318;
          font-size: 13px;
        }
  
        .booking-error.show {
          display: block;
        }
  
        .booking-submit {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 18px;
          border: 0;
          border-radius: 13px;
          background: #188f4d;
          color: #fff;
          padding: 15px 18px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }
  
        .booking-submit:hover {
          background: #137940;
        }
  
        .booking-submit:disabled {
          opacity: .65;
          cursor: wait;
        }
  
        .booking-note {
          margin: 11px 0 0;
          color: #7a828b;
          text-align: center;
          font-size: 11px;
          line-height: 1.5;
        }
  
        /* =========================
           SUCCESS
        ========================= */
  
        #bookingSuccessModal {
          position: fixed;
          inset: 0;
          z-index: 100000;
        }
  
        .success-overlay {
          opacity: 0;
          transition: opacity .2s ease;
        }
  
        #bookingSuccessModal.show .success-overlay {
          opacity: 1;
        }
  
        .success-card {
          position: relative;
          width: min(530px, 100%);
          max-height: 94vh;
          overflow-y: auto;
          padding: 35px;
          border-radius: 25px;
          background: #fff;
          box-shadow:
            0 30px 100px rgba(0,0,0,.35);
          text-align: center;
        }
  
        .success-check {
          width: 65px;
          height: 65px;
          margin: 0 auto 16px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #188f4d;
          color: #fff;
          font-size: 32px;
          font-weight: 800;
        }
  
        .success-card h2 {
          margin: 5px 0 8px;
          color: #15191f;
          font-size: 30px;
        }
  
        .success-text {
          margin: 0 auto 20px;
          max-width: 390px;
          color: #6f7780;
          font-size: 14px;
          line-height: 1.6;
        }
  
        .tracking-box {
          padding: 18px;
          border-radius: 15px;
          background: #f3f6f4;
        }
  
        .tracking-box span {
          display: block;
          color: #188f4d;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
        }
  
        .tracking-box strong {
          display: block;
          margin: 7px 0;
          color: #161b20;
          font-size: 28px;
          letter-spacing: .08em;
        }
  
        .tracking-box small {
          color: #747d86;
          font-size: 11px;
        }
  
        .success-details {
          margin: 17px 0;
          padding: 4px 15px;
          border-radius: 14px;
          background: #f7f8f9;
          text-align: left;
        }
  
        .success-details > div {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 9px 0;
          border-bottom: 1px solid #e5e8ea;
          font-size: 13px;
        }
  
        .success-details > div:last-child {
          border-bottom: 0;
        }
  
        .success-details span {
          color: #7b838c;
        }
  
        .success-details strong {
          color: #22282e;
          text-align: right;
        }
  
        .whatsapp-button {
          width: 100%;
          border: 0;
          border-radius: 13px;
          background: #25d366;
          color: #fff;
          padding: 15px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
        }
  
        .whatsapp-button:hover {
          background: #20bd5a;
        }
  
        .whatsapp-symbol {
          margin-right: 7px;
        }
  
        .success-secondary {
          width: 100%;
          margin-top: 9px;
          border: 1px solid #dce1e5;
          border-radius: 13px;
          background: #fff;
          color: #252b31;
          padding: 13px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }
  
        .success-note {
          margin: 14px 0 0;
          color: #818992;
          font-size: 10px;
          line-height: 1.5;
        }
  
        /* =========================
           MOBILE
        ========================= */
  
        @media (max-width: 650px) {
  
          .booking-overlay,
          .success-overlay {
            align-items: flex-start;
            padding: 10px;
          }
  
          .booking-card {
            max-height: 96vh;
            padding: 22px 16px;
            border-radius: 20px;
          }
  
          .booking-header {
            margin-bottom: 18px;
          }
  
          .booking-header h2 {
            font-size: 24px;
          }
  
          .booking-icon {
            width: 46px;
            height: 46px;
            flex-basis: 46px;
          }
  
          .booking-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
  
          .calendar-day {
            min-height: 37px;
          }
  
          .time-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }
  
          .success-card {
            padding: 28px 18px;
            border-radius: 20px;
          }
  
          .success-card h2 {
            font-size: 25px;
          }
  
          .tracking-box strong {
            font-size: 24px;
          }
        }
  
        @media (max-width: 390px) {
  
          .time-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }
  
          .calendar-day {
            min-height: 34px;
            font-size: 12px;
          }
        }
      `;
  
      document.head.appendChild(style);
    }
  
    /* =========================
       ESC KEY
    ========================= */
  
    document.addEventListener(
      "keydown",
      function (event) {
        if (event.key !== "Escape") return;
  
        if (bookingModal?.classList.contains("show")) {
          closeBooking();
        }
  
        if (
          document.getElementById(
            "bookingSuccessModal"
          )
        ) {
          closeSuccessModal();
        }
      }
    );
  
  })();

