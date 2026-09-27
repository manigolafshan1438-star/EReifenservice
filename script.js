/* =========================================================
   REIFENSERVICE HEIDELBERG
   COMPLETE FRONTEND SCRIPT
   Booking + Calendar + Backend + WhatsApp
   ========================================================= */

   (function () {
    "use strict";
  
    const API_URL = "https://ereifenservice-1.onrender.com";
    const WHATSAPP_NUMBER = "4917663047915";
  
    const BUSINESS_HOURS = {
      0: [],
      1: createTimeSlots("08:00", "18:30", 30),
      2: createTimeSlots("08:00", "18:30", 30),
      3: createTimeSlots("08:00", "18:30", 30),
      4: createTimeSlots("08:00", "18:30", 30),
      5: createTimeSlots("08:00", "18:30", 30),
      6: createTimeSlots("08:00", "18:00", 30)
    };
  
    let bookingModal = null;
    let selectedDate = null;
    let selectedTime = null;
    let bookedSlots = [];
    let currentMonth = new Date();
  
    function createTimeSlots(start, end, interval) {
      const slots = [];
  
      let [hour, minute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
  
      let current = hour * 60 + minute;
      const endMinutes = endHour * 60 + endMinute;
  
      while (current <= endMinutes) {
        slots.push(
          String(Math.floor(current / 60)).padStart(2, "0") +
          ":" +
          String(current % 60).padStart(2, "0")
        );
  
        current += interval;
      }
  
      return slots;
    }
  
    /* =========================================================
       MOBILE MENU
       ========================================================= */
  
    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");
  
    if (menuBtn && nav) {
      menuBtn.addEventListener("click", function () {
        const open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(open));
      });
  
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) {
          nav.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }
  
    /* =========================================================
       CONTACT FORM
       ========================================================= */
  
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
  
        const body = [
          "Name: " + name,
          "Telefon: " + tel,
          "Fahrzeug: " + fahrzeug,
          "Wunschtermin: " + datum,
          "Leistung: " + leistung,
          "",
          "Nachricht:",
          msg
        ].join("\n");
  
        window.location.href =
          "mailto:info@autoverkaufen-bw.de?subject=" +
          encodeURIComponent(
            "Terminanfrage Reifenservice Heidelberg - " +
            (leistung || "Service")
          ) +
          "&body=" +
          encodeURIComponent(body);
      });
    }
  
    function getValue(name) {
      const el = document.querySelector(`[name="${name}"]`);
      return el ? el.value.trim() : "";
    }
  
    /* =========================================================
       BOOKING MODAL
       ========================================================= */
  
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
              aria-label="Schließen"
            >×</button>
  
            <div class="booking-header">
              <div class="booking-icon">✓</div>
  
              <div>
                <div class="booking-eyebrow">
                  REIFENSERVICE HEIDELBERG
                </div>
  
                <h2>Termin buchen</h2>
  
                <p>
                  Wählen Sie Ihren Wunschtermin bequem online.
                </p>
              </div>
            </div>
  
            <form id="bookingForm">
  
              <div class="booking-grid">
  
                <div class="booking-field">
                  <label for="bookingName">
                    Name *
                  </label>
  
                  <input
                    id="bookingName"
                    name="bookingName"
                    type="text"
                    placeholder="Ihr Name"
                    required
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingPhone">
                    Telefon *
                  </label>
  
                  <input
                    id="bookingPhone"
                    name="bookingPhone"
                    type="tel"
                    placeholder="+49 176 12345678"
                    autocomplete="tel"
                    required
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingVehicle">
                    Fahrzeug
                  </label>
  
                  <input
                    id="bookingVehicle"
                    name="bookingVehicle"
                    type="text"
                    placeholder="z. B. BMW 3er"
                  >
                </div>
  
                <div class="booking-field">
                  <label for="bookingService">
                    Leistung *
                  </label>
  
                  <select
                    id="bookingService"
                    name="bookingService"
                    required
                  >
                    <option value="">
                      Bitte auswählen
                    </option>
  
                    <option value="Reifenwechsel">
                      Reifenwechsel
                    </option>
  
                    <option value="Reifenmontage">
                      Reifenmontage
                    </option>
  
                    <option value="Auswuchten">
                      Auswuchten
                    </option>
  
                    <option value="Reifenverkauf">
                      Reifenverkauf
                    </option>
  
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
                    <strong>Datum auswählen</strong>
                    <small>Sonntag geschlossen</small>
                  </div>
                </div>
  
                <div class="calendar">
  
                  <div class="calendar-head">
  
                    <button
                      type="button"
                      id="prevMonth"
                      class="calendar-arrow"
                    >‹</button>
  
                    <strong id="calendarTitle"></strong>
  
                    <button
                      type="button"
                      id="nextMonth"
                      class="calendar-arrow"
                    >›</button>
  
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
                    <strong>Uhrzeit auswählen</strong>
  
                    <small id="timeHint">
                      Zuerst ein Datum auswählen
                    </small>
                  </div>
                </div>
  
                <div
                  class="time-grid"
                  id="timeGrid"
                >
                  <div class="time-empty">
                    Bitte zuerst ein Datum auswählen.
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
                  <strong id="summaryDate">–</strong>
                </div>
  
                <div class="summary-row">
                  <span>Uhrzeit</span>
                  <strong id="summaryTime">–</strong>
                </div>
  
                <div class="summary-row">
                  <span>Leistung</span>
                  <strong id="summaryService">–</strong>
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
                <span>→</span>
              </button>
  
              <p class="booking-note">
                Mit dem Absenden wird Ihre Terminanfrage gespeichert.
                Die endgültige Terminbestätigung erfolgt durch den Betrieb.
              </p>
  
            </form>
  
          </div>
        </div>
      `;
  
      document.body.appendChild(bookingModal);
  
      setupBookingEvents();
      renderCalendar();
    }
  
    /* =========================================================
       BOOKING EVENTS
       ========================================================= */
  
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
          currentMonth.setMonth(
            currentMonth.getMonth() - 1
          );
  
          renderCalendar();
        });
      }
  
      if (next) {
        next.addEventListener("click", function () {
          currentMonth.setMonth(
            currentMonth.getMonth() + 1
          );
  
          renderCalendar();
        });
      }
  
      if (form) {
        form.addEventListener(
          "submit",
          submitBooking
        );
      }
  
      bookingModal.addEventListener(
        "click",
        function (event) {
          if (
            event.target.classList.contains(
              "booking-overlay"
            )
          ) {
            closeBooking();
          }
        }
      );
    }
  
    /* =========================================================
       OPEN BOOKING
       ========================================================= */
  
    function openBooking() {
      createBookingModal();
  
      selectedDate = null;
      selectedTime = null;
      bookedSlots = [];
  
      currentMonth = new Date();
      currentMonth.setDate(1);
  
      document.body.style.overflow = "hidden";
  
      bookingModal.classList.add("show");
  
      renderCalendar();
      renderTimes();
      updateSummary();
  
      setTimeout(function () {
        const input =
          document.getElementById("bookingName");
  
        if (input) {
          input.focus();
        }
      }, 100);
    }
  
    function closeBooking() {
      if (!bookingModal) return;
  
      bookingModal.classList.remove("show");
  
      document.body.style.overflow = "";
    }
  
    /* =========================================================
       BOOKING BUTTONS
       ========================================================= */
  
    document.addEventListener(
      "click",
      function (event) {
        const button =
          event.target.closest(
            "[data-termin], .mobile-bar .cal, .mbar .sq"
          );
  
        if (!button) return;
  
        event.preventDefault();
  
        openBooking();
      }
    );
  
    document.addEventListener(
      "click",
      function (event) {
        const button =
          event.target.closest(
            'a[href="#kontakt"]'
          );
  
        if (!button) return;
  
        const text =
          (button.textContent || "").toLowerCase();
  
        if (
          text.includes("termin") ||
          text.includes("beratung")
        ) {
          event.preventDefault();
          openBooking();
        }
      }
    );
  
    /* =========================================================
       CALENDAR
       ========================================================= */
  
    function renderCalendar() {
      const title =
        document.getElementById(
          "calendarTitle"
        );
  
      const container =
        document.getElementById(
          "calendarDays"
        );
  
      if (!title || !container) return;
  
      const year =
        currentMonth.getFullYear();
  
      const month =
        currentMonth.getMonth();
  
      const monthName =
        new Intl.DateTimeFormat(
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
  
      const firstDay =
        new Date(year, month, 1);
  
      let weekday =
        firstDay.getDay();
  
      weekday =
        weekday === 0
          ? 6
          : weekday - 1;
  
      for (
        let i = 0;
        i < weekday;
        i++
      ) {
        const empty =
          document.createElement("span");
  
        empty.className =
          "calendar-empty";
  
        container.appendChild(empty);
      }
  
      const daysInMonth =
        new Date(
          year,
          month + 1,
          0
        ).getDate();
  
      const today = new Date();
  
      today.setHours(
        0,
        0,
        0,
        0
      );
  
      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const date =
          new Date(
            year,
            month,
            day
          );
  
        date.setHours(
          0,
          0,
          0,
          0
        );
  
        const button =
          document.createElement(
            "button"
          );
  
        button.type = "button";
  
        button.className =
          "calendar-day";
  
        button.textContent = day;
  
        const dateString =
          formatDateISO(date);
  
        button.dataset.date =
          dateString;
  
        const isSunday =
          date.getDay() === 0;
  
        const isPast =
          date < today;
  
        if (
          isSunday ||
          isPast
        ) {
          button.disabled = true;
          button.classList.add(
            "disabled"
          );
        }
  
        if (
          date.getTime() ===
          today.getTime()
        ) {
          button.classList.add(
            "today"
          );
        }
  
        if (
          selectedDate ===
          dateString
        ) {
          button.classList.add(
            "selected"
          );
        }
  
        button.addEventListener(
          "click",
          function () {
            selectDate(
              dateString
            );
          }
        );
  
        container.appendChild(
          button
        );
      }
    }
  
    async function selectDate(dateString) {
      selectedDate = dateString;
      selectedTime = null;
      bookedSlots = [];
  
      renderCalendar();
      renderTimes();
      updateSummary();
  
      await loadBookedSlots(
        dateString
      );
    }
  
    /* =========================================================
       LOAD BOOKED SLOTS
       ========================================================= */
  
    async function loadBookedSlots(date) {
      try {
        const response =
          await fetch(
            API_URL +
              "/api/bookings/slots?date=" +
              encodeURIComponent(date),
            {
              method: "GET",
              cache: "no-store"
            }
          );
  
        if (!response.ok) {
          throw new Error(
            "Slots konnten nicht geladen werden."
          );
        }
  
        const data =
          await response.json();
  
        bookedSlots =
          Array.isArray(
            data.bookedTimes
          )
            ? data.bookedTimes
            : [];
  
        renderTimes();
  
      } catch (error) {
        console.error(
          "Slot loading error:",
          error
        );
  
        bookedSlots = [];
  
        renderTimes();
      }
    }
  
    /* =========================================================
       TIME SLOTS
       ========================================================= */
  
    function renderTimes() {
      const grid =
        document.getElementById(
          "timeGrid"
        );
  
      const hint =
        document.getElementById(
          "timeHint"
        );
  
      if (!grid) return;
  
      grid.innerHTML = "";
  
      if (!selectedDate) {
        grid.innerHTML = `
          <div class="time-empty">
            Bitte zuerst ein Datum auswählen.
          </div>
        `;
  
        if (hint) {
          hint.textContent =
            "Zuerst ein Datum auswählen";
        }
  
        return;
      }
  
      const date =
        parseDateISO(
          selectedDate
        );
  
      const day =
        date.getDay();
  
      const slots =
        BUSINESS_HOURS[day] || [];
  
      if (!slots.length) {
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
            ? "Samstag: 08:00–18:00 Uhr"
            : "Montag–Freitag: 08:00–18:30 Uhr";
      }
  
      slots.forEach(
        function (time) {
          const button =
            document.createElement(
              "button"
            );
  
          button.type = "button";
  
          button.className =
            "time-button";
  
          button.textContent =
            time;
  
          const isBooked =
            bookedSlots.some(
              function (booked) {
                return normalizeTime(
                  booked
                ) ===
                  normalizeTime(
                    time
                  );
              }
            );
  
          if (isBooked) {
            button.disabled = true;
  
            button.classList.add(
              "disabled",
              "booked"
            );
  
            button.textContent =
              time + " – Belegt";
          }
  
          if (
            selectedTime ===
              time &&
            !isBooked
          ) {
            button.classList.add(
              "selected"
            );
          }
  
          button.addEventListener(
            "click",
            function () {
              if (
                button.disabled
              ) {
                return;
              }
  
              selectedTime =
                time;
  
              document
                .querySelectorAll(
                  ".time-button"
                )
                .forEach(
                  function (item) {
                    item.classList.remove(
                      "selected"
                    );
                  }
                );
  
              button.classList.add(
                "selected"
              );
  
              updateSummary();
            }
          );
  
          grid.appendChild(
            button
          );
        }
      );
    }
  
    function normalizeTime(time) {
      if (!time) return "";
  
      return String(time)
        .trim()
        .slice(0, 5);
    }
  
    /* =========================================================
       SUMMARY
       ========================================================= */
  
    function updateSummary() {
      const dateElement =
        document.getElementById(
          "summaryDate"
        );
  
      const timeElement =
        document.getElementById(
          "summaryTime"
        );
  
      const serviceElement =
        document.getElementById(
          "summaryService"
        );
  
      if (dateElement) {
        dateElement.textContent =
          selectedDate
            ? formatGermanDate(
                selectedDate
              )
            : "–";
      }
  
      if (timeElement) {
        timeElement.textContent =
          selectedTime
            ? selectedTime +
              " Uhr"
            : "–";
      }
  
      const service =
        document.getElementById(
          "bookingService"
        );
  
      if (serviceElement) {
        serviceElement.textContent =
          service &&
          service.value
            ? service.value
            : "–";
      }
    }
  
    document.addEventListener(
      "change",
      function (event) {
        if (
          event.target &&
          event.target.id ===
            "bookingService"
        ) {
          updateSummary();
        }
      }
    );
  
    /* =========================================================
       SUBMIT BOOKING
       ========================================================= */
  
    async function submitBooking(event) {
      event.preventDefault();
  
      const errorBox =
        document.getElementById(
          "bookingError"
        );
  
      const submitButton =
        document.getElementById(
          "bookingSubmit"
        );
  
      if (errorBox) {
        errorBox.textContent = "";
        errorBox.classList.remove(
          "show"
        );
      }
  
      const name =
        document.getElementById(
          "bookingName"
        )?.value.trim();
  
      const phone =
        document.getElementById(
          "bookingPhone"
        )?.value.trim();
  
      const vehicle =
        document.getElementById(
          "bookingVehicle"
        )?.value.trim();
  
      const service =
        document.getElementById(
          "bookingService"
        )?.value.trim();
  
      const message =
        document.getElementById(
          "bookingMessage"
        )?.value.trim();
  
      if (
        !name ||
        !phone ||
        !service
      ) {
        showBookingError(
          "Bitte füllen Sie Name, Telefon und Leistung aus."
        );
  
        return;
      }
  
      if (
        !isValidGermanPhone(
          phone
        )
      ) {
        showBookingError(
          "Bitte geben Sie eine gültige deutsche Telefonnummer ein, z. B. 0176 12345678 oder +49 176 12345678."
        );
  
        return;
      }
  
      if (!selectedDate) {
        showBookingError(
          "Bitte wählen Sie ein Datum aus."
        );
  
        return;
      }
  
      if (!selectedTime) {
        showBookingError(
          "Bitte wählen Sie eine Uhrzeit aus."
        );
  
        return;
      }
  
      if (
        bookedSlots.some(
          function (time) {
            return (
              normalizeTime(
                time
              ) ===
              normalizeTime(
                selectedTime
              )
            );
          }
        )
      ) {
        showBookingError(
          "Dieser Termin ist bereits vergeben. Bitte wählen Sie eine andere Uhrzeit."
        );
  
        await loadBookedSlots(
          selectedDate
        );
  
        return;
      }
  
      const selected =
        parseDateISO(
          selectedDate
        );
  
      if (
        selected.getDay() === 0
      ) {
        showBookingError(
          "Sonntag ist geschlossen. Bitte wählen Sie einen anderen Tag."
        );
  
        return;
      }
  
      if (submitButton) {
        submitButton.disabled =
          true;
  
        submitButton.innerHTML =
          "<span>Wird gespeichert...</span><span>...</span>";
      }
  
      const bookingData = {
        name,
        phone,
        vehicle,
        service,
        date: selectedDate,
        time: selectedTime,
        message
      };
  
      try {
        const controller =
          new AbortController();
  
        const timeout =
          setTimeout(
            function () {
              controller.abort();
            },
            15000
          );
  
        let response;
  
        try {
          response =
            await fetch(
              API_URL +
                "/api/bookings",
              {
                method: "POST",
  
                headers: {
                  "Content-Type":
                    "application/json"
                },
  
                body:
                  JSON.stringify(
                    bookingData
                  ),
  
                signal:
                  controller.signal
              }
            );
        } finally {
          clearTimeout(
            timeout
          );
        }
  
        let data = null;
  
        try {
          data =
            await response.json();
        } catch {
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
          data?.booking
            ?.trackingCode;
  
        if (!trackingCode) {
          throw new Error(
            "Die Buchung wurde nicht mit einer gültigen Buchungsnummer bestätigt."
          );
        }
  
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
  
        let message =
          "Die Terminanfrage konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.";
  
        if (
          error?.name ===
          "AbortError"
        ) {
          message =
            "Der Server antwortet zu langsam. Bitte versuchen Sie es in wenigen Sekunden erneut.";
        } else if (
          error?.message &&
          error.message.length <
            250
        ) {
          message =
            error.message;
        }
  
        showBookingError(
          message
        );
  
        if (submitButton) {
          submitButton.disabled =
            false;
  
          submitButton.innerHTML =
            "<span>Termin anfragen</span><span>→</span>";
        }
      }
    }
  
    /* =========================================================
       SUCCESS MODAL
       ========================================================= */
  
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
        document.createElement(
          "div"
        );
  
      modal.id =
        "bookingSuccessModal";
  
      modal.innerHTML = `
        <div class="success-overlay">
  
          <div class="success-card">
  
            <button
              type="button"
              class="success-close"
              id="successClose"
              aria-label="Schließen"
            >×</button>
  
            <div class="success-check">
              ✓
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
                ${escapeHtml(
                  trackingCode
                )}
              </strong>
  
              <small>
                Bitte bewahren Sie diese Buchungsnummer für Ihre Anfrage auf.
              </small>
  
            </div>
  
            <div class="success-details">
  
              <div>
                <span>Name</span>
                <strong>
                  ${escapeHtml(
                    booking.name
                  )}
                </strong>
              </div>
  
              <div>
                <span>Datum</span>
                <strong>
                  ${escapeHtml(
                    formatGermanDate(
                      booking.date
                    )
                  )}
                </strong>
              </div>
  
              <div>
                <span>Uhrzeit</span>
                <strong>
                  ${escapeHtml(
                    booking.time
                  )} Uhr
                </strong>
              </div>
  
              <div>
                <span>Leistung</span>
                <strong>
                  ${escapeHtml(
                    booking.service
                  )}
                </strong>
              </div>
  
            </div>
  
            <button
              type="button"
              class="whatsapp-button"
              id="sendWhatsApp"
            >
              <span class="whatsapp-symbol">◉</span>
              Termin per WhatsApp senden
            </button>
  
            <button
              type="button"
              class="success-secondary"
              id="successClose2"
            >
              Schließen
            </button>
  
            <p class="success-note">
              Die WhatsApp-Nachricht wird auf Ihrem Gerät vorbereitet.
              Zum Absenden müssen Sie in WhatsApp noch auf „Senden“ drücken.
            </p>
  
          </div>
  
        </div>
      `;
  
      document.body.appendChild(
        modal
      );
  
      document.body.style.overflow =
        "hidden";
  
      const close1 =
        document.getElementById(
          "successClose"
        );
  
      const close2 =
        document.getElementById(
          "successClose2"
        );
  
      const whatsapp =
        document.getElementById(
          "sendWhatsApp"
        );
  
      if (close1) {
        close1.addEventListener(
          "click",
          closeSuccessModal
        );
      }
  
      if (close2) {
        close2.addEventListener(
          "click",
          closeSuccessModal
        );
      }
  
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
  
      document.body.style.overflow =
        "";
    }
  
    /* =========================================================
       WHATSAPP
       ========================================================= */
  
    function openWhatsApp(
      booking,
      trackingCode
    ) {
      const message = [
        "Hallo Reifenservice Heidelberg,",
        "",
        "ich habe gerade eine Terminanfrage über Ihre Website gesendet.",
        "",
        "Buchungsnummer: " +
          trackingCode,
        "Name: " +
          booking.name,
        "Telefon: " +
          booking.phone,
        "Fahrzeug: " +
          (booking.vehicle ||
            "-"),
        "Leistung: " +
          booking.service,
        "Datum: " +
          formatGermanDate(
            booking.date
          ),
        "Uhrzeit: " +
          booking.time +
          " Uhr",
        "",
        booking.message
          ? "Nachricht: " +
            booking.message
          : "",
        "",
        "Bitte bestätigen Sie meinen Termin."
      ]
        .filter(Boolean)
        .join("\n");
  
      const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
          message
        );
  
      const mobile =
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        );
  
      if (mobile) {
        window.location.href =
          url;
      } else {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }
  
    /* =========================================================
       GERMAN PHONE VALIDATION
       ========================================================= */
  
    function isValidGermanPhone(
      phone
    ) {
      const cleaned =
        String(phone || "")
          .trim()
          .replace(
            /[\s()-]/g,
            ""
          );
  
      return /^(?:\+49|0049|0)1[5-7]\d{8,9}$/.test(
        cleaned
      );
    }
  
    /* =========================================================
       ERROR
       ========================================================= */
  
    function showBookingError(
      message
    ) {
      const errorBox =
        document.getElementById(
          "bookingError"
        );
  
      if (!errorBox) return;
  
      errorBox.textContent =
        message;
  
      errorBox.classList.add(
        "show"
      );
    }
  
    /* =========================================================
       DATE HELPERS
       ========================================================= */
  
    function formatDateISO(
      date
    ) {
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
  
      return (
        year +
        "-" +
        month +
        "-" +
        day
      );
    }
  
    function parseDateISO(
      value
    ) {
      const [
        year,
        month,
        day
      ] = value
        .split("-")
        .map(Number);
  
      return new Date(
        year,
        month - 1,
        day
      );
    }
  
    function formatGermanDate(
      value
    ) {
      const date =
        parseDateISO(
          value
        );
  
      return new Intl.DateTimeFormat(
        "de-DE",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }
      ).format(date);
    }
  
    /* =========================================================
       HTML ESCAPE
       ========================================================= */
  
    function escapeHtml(
      value
    ) {
      return String(
        value ?? ""
      )
        .replace(
          /&/g,
          "&amp;"
        )
        .replace(
          /</g,
          "&lt;"
        )
        .replace(
          />/g,
          "&gt;"
        )
        .replace(
          /"/g,
          "&quot;"
        )
        .replace(
          /'/g,
          "&#039;"
        );
    }
  
    /* =========================================================
       EXTRA PHONE VALIDATION
       ========================================================= */
  
    document.addEventListener(
      "input",
      function (event) {
        const input =
          event.target;
  
        if (
          !input ||
          input.type !== "tel"
        ) {
          return;
        }
  
        input.setCustomValidity("");
  
        if (
          input.value.trim() &&
          !isValidGermanPhone(
            input.value
          )
        ) {
          input.setCustomValidity(
            "Bitte geben Sie eine gültige deutsche Telefonnummer ein."
          );
        }
      }
    );
  
    /* =========================================================
       WHATSAPP TEXT FIX
       ========================================================= */
  
    function fixWhatsAppButtons() {
      document
        .querySelectorAll(
          "button, a"
        )
        .forEach(
          function (element) {
            const text =
              (
                element.textContent ||
                ""
              ).trim();
  
            if (
              text.includes(
                "WhatsApp"
              ) &&
              text.includes(
                "senden"
              )
            ) {
              element.innerHTML =
                '<span class="whatsapp-symbol">◉</span>Termin per WhatsApp senden';
            }
          }
        );
    }
  
    fixWhatsAppButtons();
  
    const observer =
      new MutationObserver(
        function () {
          fixWhatsAppButtons();
        }
      );
  
    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  
    /* =========================================================
       START
       ========================================================= */
  
    document.addEventListener(
      "DOMContentLoaded",
      function () {
        injectBookingStyles();
      }
    );
  
    /* =========================================================
       BOOKING STYLES
       ========================================================= */
  
    function injectBookingStyles() {
      if (
        document.getElementById(
          "bookingRuntimeStyles"
        )
      ) {
        return;
      }
  
      const style =
        document.createElement(
          "style"
        );
  
      style.id =
        "bookingRuntimeStyles";
  
      style.textContent = `
        .booking-overlay,
        .success-overlay {
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: rgba(0,0,0,.78);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
  
        .booking-modal,
        #bookingModal,
        #bookingSuccessModal {
          font-family: Arial, sans-serif;
        }
  
        .booking-card,
        .success-card {
          position: relative;
          width: min(920px, 100%);
          max-height: 94vh;
          overflow-y: auto;
          background: #fff;
          color: #111;
          border-radius: 22px;
          padding: 28px;
          box-sizing: border-box;
          box-shadow: 0 30px 90px rgba(0,0,0,.4);
        }
  
        .booking-close,
        .success-close {
          position: absolute;
          top: 14px;
          right: 16px;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 50%;
          background: #f1f1f1;
          font-size: 28px;
          cursor: pointer;
          z-index: 5;
        }
  
        .booking-header {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 25px;
        }
  
        .booking-icon,
        .success-check {
          width: 54px;
          height: 54px;
          min-width: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #16a34a;
          color: #fff;
          font-size: 28px;
          font-weight: 700;
        }
  
        .booking-eyebrow,
        .success-eyebrow {
          color: #16a34a;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .12em;
        }
  
        .booking-header h2,
        .success-card h2 {
          margin: 4px 0;
          font-size: 28px;
        }
  
        .booking-header p,
        .success-text {
          margin: 0;
          color: #666;
        }
  
        .booking-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
  
        .booking-field {
          margin-bottom: 16px;
        }
  
        .booking-field label {
          display: block;
          margin-bottom: 7px;
          font-size: 14px;
          font-weight: 700;
        }
  
        .booking-field input,
        .booking-field select,
        .booking-field textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d7d7d7;
          border-radius: 12px;
          padding: 13px 14px;
          font-size: 15px;
          outline: none;
          background: #fff;
        }
  
        .booking-field input:focus,
        .booking-field select:focus,
        .booking-field textarea:focus {
          border-color: #16a34a;
        }
  
        .booking-section {
          margin-top: 22px;
        }
  
        .booking-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
  
        .booking-section-title > span {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          color: #fff;
          font-weight: 800;
        }
  
        .booking-section-title strong,
        .booking-section-title small {
          display: block;
        }
  
        .booking-section-title small {
          color: #777;
          margin-top: 3px;
        }
  
        .calendar {
          border: 1px solid #e1e1e1;
          border-radius: 16px;
          overflow: hidden;
        }
  
        .calendar-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 13px 16px;
          background: #f7f7f7;
        }
  
        .calendar-arrow {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          font-size: 24px;
        }
  
        .calendar-weekdays,
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
          padding: 10px;
        }
  
        .calendar-weekdays span {
          text-align: center;
          color: #777;
          font-size: 12px;
          font-weight: 700;
        }
  
        .calendar-day {
          min-height: 42px;
          border: 0;
          border-radius: 10px;
          background: #f5f5f5;
          cursor: pointer;
          font-weight: 600;
        }
  
        .calendar-day:hover:not(:disabled) {
          background: #dcfce7;
        }
  
        .calendar-day.today {
          box-shadow: inset 0 0 0 2px #16a34a;
        }
  
        .calendar-day.selected {
          background: #16a34a;
          color: #fff;
        }
  
        .calendar-day.disabled {
          opacity: .35;
          cursor: not-allowed;
        }
  
        .calendar-empty {
          min-height: 42px;
        }
  
        .time-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
  
        .time-button {
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 11px 7px;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
        }
  
        .time-button:hover:not(:disabled) {
          border-color: #16a34a;
        }
  
        .time-button.selected {
          background: #16a34a;
          color: #fff;
          border-color: #16a34a;
        }
  
        .time-button.booked,
        .time-button:disabled {
          background: #f1f1f1;
          color: #999;
          cursor: not-allowed;
          text-decoration: line-through;
        }
  
        .time-empty {
          grid-column: 1 / -1;
          padding: 18px;
          text-align: center;
          color: #777;
          background: #f7f7f7;
          border-radius: 12px;
        }
  
        .booking-summary {
          margin-top: 20px;
          padding: 17px;
          border-radius: 14px;
          background: #f7f7f7;
        }
  
        .summary-title {
          font-weight: 800;
          margin-bottom: 10px;
        }
  
        .summary-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 5px 0;
        }
  
        .summary-row span {
          color: #777;
        }
  
        .booking-error {
          display: none;
          margin-top: 15px;
          padding: 12px 14px;
          border-radius: 10px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 14px;
        }
  
        .booking-error.show {
          display: block;
        }
  
        .booking-submit {
          width: 100%;
          margin-top: 18px;
          border: 0;
          border-radius: 13px;
          padding: 15px 18px;
          background: #16a34a;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
        }
  
        .booking-submit:disabled {
          opacity: .65;
          cursor: wait;
        }
  
        .booking-note,
        .success-note {
          text-align: center;
          color: #777;
          font-size: 12px;
          line-height: 1.5;
        }
  
        .success-card {
          max-width: 560px;
          text-align: center;
        }
  
        .success-check {
          margin: 0 auto 16px;
        }
  
        .tracking-box {
          margin: 22px 0;
          padding: 18px;
          border-radius: 15px;
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
        }
  
        .tracking-box span,
        .tracking-box small {
          display: block;
        }
  
        .tracking-box span {
          font-size: 11px;
          font-weight: 800;
          color: #15803d;
        }
  
        .tracking-box strong {
          display: block;
          margin: 8px 0;
          font-size: 28px;
          letter-spacing: .08em;
          color: #166534;
        }
  
        .tracking-box small {
          color: #4b5563;
        }
  
        .success-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          text-align: left;
          margin-bottom: 18px;
        }
  
        .success-details div {
          padding: 12px;
          background: #f7f7f7;
          border-radius: 10px;
        }
  
        .success-details span,
        .success-details strong {
          display: block;
        }
  
        .success-details span {
          color: #777;
          font-size: 12px;
          margin-bottom: 4px;
        }
  
        .whatsapp-button {
          width: 100%;
          border: 0;
          border-radius: 13px;
          padding: 15px;
          background: #25d366;
          color: #fff;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
        }
  
        .whatsapp-symbol {
          margin-right: 7px;
        }
  
        .success-secondary {
          width: 100%;
          margin-top: 10px;
          padding: 13px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background: #fff;
          cursor: pointer;
          font-weight: 700;
        }
  
        @media (max-width: 700px) {
  
          .booking-overlay,
          .success-overlay {
            align-items: flex-start;
            padding: 10px;
          }
  
          .booking-card,
          .success-card {
            width: 100%;
            max-height: 96vh;
            padding: 20px 14px;
            border-radius: 17px;
          }
  
          .booking-header {
            padding-right: 35px;
          }
  
          .booking-header h2,
          .success-card h2 {
            font-size: 22px;
          }
  
          .booking-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
  
          .time-grid {
            grid-template-columns: repeat(3, 1fr);
          }
  
          .calendar-weekdays,
          .calendar-days {
            gap: 4px;
            padding: 7px;
          }
  
          .calendar-day {
            min-height: 38px;
          }
  
          .success-details {
            grid-template-columns: 1fr;
          }
  
          .tracking-box strong {
            font-size: 23px;
            word-break: break-word;
          }
        }
  
        @media (max-width: 420px) {
          .time-grid {
            grid-template-columns: repeat(2, 1fr);
          }
  
          .booking-card {
            padding: 17px 11px;
          }
        }
      `;
  
      document.head.appendChild(
        style
      );
    }
  
    injectBookingStyles();
  
  })();