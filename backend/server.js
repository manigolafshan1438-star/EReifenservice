const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const crypto = require("crypto");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());


/* =========================
   DATABASE
========================= */

const db = new Database(
  process.env.DB_PATH ||
  path.join(__dirname, "bookings.db")
);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    vehicle TEXT,
    service TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  )
`);


/* =========================
   PREVENT DOUBLE BOOKINGS
========================= */

db.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS unique_active_booking
  ON bookings (booking_date, booking_time)
  WHERE status != 'cancelled'
`);


/* =========================
   GERMAN PHONE VALIDATION
========================= */

function isValidGermanPhone(phone) {

  const cleaned = String(phone || "")
    .trim()
    .replace(/[\s()-]/g, "");

  return /^(?:\+49|0049|0)1[5-7]\d{8,9}$/.test(cleaned);
}


/* =========================
   TRACKING CODE
========================= */

function generateTrackingCode() {

  let code;

  do {

    const random =
      crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    code = `RH-${random}`;

  } while (
    db
      .prepare(
        "SELECT id FROM bookings WHERE tracking_code = ?"
      )
      .get(code)
  );

  return code;
}


/* =========================
   HEALTH CHECK
========================= */

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Reifenservice Heidelberg Backend läuft.",
    time: new Date().toISOString()
  });

});


/* =========================
   GET BOOKED TIMES
========================= */

app.get("/api/bookings/slots", (req, res) => {

  try {

    const { date } = req.query;

    if (!date) {

      return res.status(400).json({
        success: false,
        message: "Datum fehlt."
      });

    }

    const bookings = db
      .prepare(`
        SELECT booking_time
        FROM bookings
        WHERE booking_date = ?
        AND status != 'cancelled'
        ORDER BY booking_time
      `)
      .all(date);

    const bookedTimes =
      bookings.map(
        booking => booking.booking_time
      );

    res.json({
      success: true,
      date,
      bookedTimes
    });

  } catch (error) {

    console.error(
      "Slots Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Die belegten Termine konnten nicht geladen werden."
    });

  }

});


/* =========================
   CREATE BOOKING
========================= */

app.post("/api/bookings", (req, res) => {

  try {

    const {
      name,
      phone,
      vehicle,
      service,
      date,
      time,
      message
    } = req.body;


    /* REQUIRED FIELDS */

    if (
      !name ||
      !phone ||
      !service ||
      !date ||
      !time
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Bitte füllen Sie alle Pflichtfelder aus."
      });

    }


    /* GERMAN PHONE */

    if (!isValidGermanPhone(phone)) {

      return res.status(400).json({
        success: false,
        message:
          "Bitte geben Sie eine gültige deutsche Telefonnummer ein."
      });

    }


    /* CHECK SLOT */

    const existingBooking =
      db
        .prepare(`
          SELECT id
          FROM bookings
          WHERE booking_date = ?
          AND booking_time = ?
          AND status != 'cancelled'
        `)
        .get(date, time);


    if (existingBooking) {

      return res.status(409).json({

        success: false,

        message:
          "Dieser Termin ist bereits vergeben. Bitte wählen Sie eine andere Uhrzeit."

      });

    }


    /* TRACKING CODE */

    const trackingCode =
      generateTrackingCode();


    /* CREATE BOOKING */

    const createdAt =
      new Date().toISOString();


    const insert =
      db.prepare(`
        INSERT INTO bookings (
          tracking_code,
          name,
          phone,
          vehicle,
          service,
          booking_date,
          booking_time,
          message,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);


    insert.run(
      trackingCode,
      name.trim(),
      phone.trim(),
      vehicle ? vehicle.trim() : "",
      service.trim(),
      date,
      time,
      message ? message.trim() : "",
      "pending",
      createdAt
    );


    /* RESPONSE */

    res.status(201).json({

      success: true,

      message:
        "Ihre Terminanfrage wurde erfolgreich gespeichert.",

      trackingCode,

      booking: {

        name: name.trim(),

        phone: phone.trim(),

        vehicle:
          vehicle ? vehicle.trim() : "",

        service:
          service.trim(),

        date,

        time,

        message:
          message ? message.trim() : "",

        status: "pending"

      }

    });

  } catch (error) {

    /* DOUBLE BOOKING SAFETY */

    if (
      error.code ===
      "SQLITE_CONSTRAINT_UNIQUE"
    ) {

      return res.status(409).json({

        success: false,

        message:
          "Dieser Termin ist bereits vergeben. Bitte wählen Sie eine andere Uhrzeit."

      });

    }


    console.error(
      "Booking Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Beim Speichern der Terminanfrage ist ein Fehler aufgetreten."

    });

  }

});


/* =========================
   FIND BOOKING BY CODE
========================= */

app.get(
  "/api/bookings/:trackingCode",
  (req, res) => {

    try {

      const trackingCode =
        req.params.trackingCode
          .trim()
          .toUpperCase();


      const booking =
        db
          .prepare(`
            SELECT
              tracking_code,
              name,
              phone,
              vehicle,
              service,
              booking_date,
              booking_time,
              status,
              created_at
            FROM bookings
            WHERE tracking_code = ?
          `)
          .get(trackingCode);


      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Buchungsnummer wurde nicht gefunden."

        });

      }


      res.json({

        success: true,

        booking

      });

    } catch (error) {

      console.error(
        "Tracking Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Die Buchung konnte nicht abgerufen werden."

      });

    }

  }
);


/* =========================
   START SERVER
========================= */

app.listen(
  PORT,
  HOST,
  () => {

    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      " Reifenservice Heidelberg Backend"
    );
    console.log(
      "======================================"
    );
    console.log(
      ` Server läuft auf Port ${PORT}`
    );
    console.log(
      ` http://${HOST}:${PORT}`
    );
    console.log(
      "======================================"
    );
    console.log("");

  }
);