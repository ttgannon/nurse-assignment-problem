/**
 * Nursify demo seed.
 *
 * Creates 5 hospital units with realistic nurse and patient populations.
 * Patient acuity distributions are calibrated per unit type:
 *   ICU       → high devices/drips, tube feeds, trachs, non-mobile
 *   Telemetry → moderate complexity, cardiac diagnoses
 *   PCU       → step-down, recovering from ICU-level illness
 *   Med-Surg  → lower acuity, more mobile, fewer devices
 *
 * Run with: npm run db:seed
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Unit definitions ─────────────────────────────────────────────────────────

const UNITS = [
  { id: 1, unit_name: "Medical ICU (MICU)" },
  { id: 2, unit_name: "Surgical ICU (SICU)" },
  { id: 3, unit_name: "Telemetry" },
  { id: 4, unit_name: "Progressive Care Unit (PCU)" },
  { id: 5, unit_name: "Medical-Surgical" },
];

// ─── Nurses ───────────────────────────────────────────────────────────────────

const NURSES = [
  // MICU — 4 nurses, 1:2 patient ratio
  { nurse_name: "Alicia Torres, RN",    years_exp: 8,  unit: 1 },
  { nurse_name: "James Okafor, RN",     years_exp: 3,  unit: 1 },
  { nurse_name: "Maria Chen, RN",       years_exp: 12, unit: 1 },
  { nurse_name: "Derek Walsh, RN",      years_exp: 5,  unit: 1 },

  // SICU — 4 nurses
  { nurse_name: "Priya Nair, RN",       years_exp: 9,  unit: 2 },
  { nurse_name: "Samuel Brooks, RN",    years_exp: 2,  unit: 2 },
  { nurse_name: "Fatima Hassan, RN",    years_exp: 15, unit: 2 },
  { nurse_name: "Tyler Gomez, RN",      years_exp: 4,  unit: 2 },

  // Telemetry — 5 nurses, 1:4 ratio
  { nurse_name: "Nicole Adams, RN",     years_exp: 6,  unit: 3 },
  { nurse_name: "Andre Dupont, RN",     years_exp: 11, unit: 3 },
  { nurse_name: "Lauren Kim, RN",       years_exp: 1,  unit: 3 },
  { nurse_name: "Marcus Reyes, RN",     years_exp: 7,  unit: 3 },
  { nurse_name: "Sophie Patel, RN",     years_exp: 14, unit: 3 },

  // PCU — 5 nurses, 1:3–4 ratio
  { nurse_name: "Diana Flores, RN",     years_exp: 3,  unit: 4 },
  { nurse_name: "Kevin Nguyen, RN",     years_exp: 8,  unit: 4 },
  { nurse_name: "Aisha Williams, RN",   years_exp: 10, unit: 4 },
  { nurse_name: "Ryan O'Brien, RN",     years_exp: 5,  unit: 4 },
  { nurse_name: "Lena Petrova, RN",     years_exp: 2,  unit: 4 },

  // Med-Surg — 6 nurses, 1:5 ratio
  { nurse_name: "Carla Mendez, RN",     years_exp: 4,  unit: 5 },
  { nurse_name: "Jason Park, RN",       years_exp: 7,  unit: 5 },
  { nurse_name: "Tanya Bell, RN",       years_exp: 1,  unit: 5 },
  { nurse_name: "Omar Khalid, RN",      years_exp: 9,  unit: 5 },
  { nurse_name: "Bridget O'Connor, RN", years_exp: 13, unit: 5 },
  { nurse_name: "Zach Turner, RN",      years_exp: 3,  unit: 5 },
];

// ─── Patients ─────────────────────────────────────────────────────────────────

const PATIENTS = [
  // ── MICU (unit 1) — 8 critically ill patients ──
  {
    patient_id: "MICU-001", first_name: "Harold",   last_name: "Fletcher",
    gender: "M", icd_10: "J96.00", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 14, high_risk_meds: 4, num_devices: 5, num_drips: 3,
    new_trach: 1, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "MICU-002", first_name: "Margaret", last_name: "Yuen",
    gender: "F", icd_10: "I21.9", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 12, high_risk_meds: 3, num_devices: 4, num_drips: 2,
    new_trach: 0, tube_feeds: 1, wound_care: 1,
  },
  {
    patient_id: "MICU-003", first_name: "Dennis",   last_name: "Ramirez",
    gender: "M", icd_10: "N17.9", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 10, high_risk_meds: 2, num_devices: 4, num_drips: 2,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MICU-004", first_name: "Eleanor",  last_name: "Shah",
    gender: "F", icd_10: "G93.1", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 3, num_devices: 3, num_drips: 2,
    new_trach: 1, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "MICU-005", first_name: "Victor",   last_name: "Osei",
    gender: "M", icd_10: "A41.9", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 13, high_risk_meds: 4, num_devices: 5, num_drips: 4,
    new_trach: 0, tube_feeds: 1, wound_care: 1,
  },
  {
    patient_id: "MICU-006", first_name: "Constance", last_name: "Murphy",
    gender: "F", icd_10: "J18.1", unit: 1,
    continent: true, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 1, num_devices: 3, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MICU-007", first_name: "Arthur",   last_name: "Petrov",
    gender: "M", icd_10: "K72.9", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 11, high_risk_meds: 2, num_devices: 4, num_drips: 3,
    new_trach: 0, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "MICU-008", first_name: "Grace",    last_name: "Lindberg",
    gender: "F", icd_10: "I50.9", unit: 1,
    continent: false, independently_mobile: false,
    num_meds: 12, high_risk_meds: 3, num_devices: 4, num_drips: 2,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },

  // ── SICU (unit 2) — 8 post-surgical / trauma patients ──
  {
    patient_id: "SICU-001", first_name: "Bruno",    last_name: "Castillo",
    gender: "M", icd_10: "K65.0", unit: 2,
    continent: false, independently_mobile: false,
    num_meds: 10, high_risk_meds: 3, num_devices: 4, num_drips: 2,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "SICU-002", first_name: "Helen",    last_name: "Nakamura",
    gender: "F", icd_10: "K92.1", unit: 2,
    continent: true, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 2, num_devices: 3, num_drips: 2,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "SICU-003", first_name: "Frank",    last_name: "Oduya",
    gender: "M", icd_10: "T79.5", unit: 2,
    continent: false, independently_mobile: false,
    num_meds: 11, high_risk_meds: 3, num_devices: 5, num_drips: 3,
    new_trach: 1, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "SICU-004", first_name: "Patricia", last_name: "Stern",
    gender: "F", icd_10: "Z96.641", unit: 2,
    continent: true, independently_mobile: false,
    num_meds: 7,  high_risk_meds: 1, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "SICU-005", first_name: "Leon",     last_name: "Ibarra",
    gender: "M", icd_10: "S72.001A", unit: 2,
    continent: false, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 2, num_devices: 3, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "SICU-006", first_name: "Ruth",     last_name: "Andersen",
    gender: "F", icd_10: "C18.9", unit: 2,
    continent: true, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 2, num_devices: 3, num_drips: 2,
    new_trach: 0, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "SICU-007", first_name: "Elliot",   last_name: "Fox",
    gender: "M", icd_10: "I71.2", unit: 2,
    continent: false, independently_mobile: false,
    num_meds: 10, high_risk_meds: 3, num_devices: 4, num_drips: 2,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "SICU-008", first_name: "Dora",     last_name: "Vance",
    gender: "F", icd_10: "J95.821", unit: 2,
    continent: false, independently_mobile: false,
    num_meds: 11, high_risk_meds: 2, num_devices: 4, num_drips: 3,
    new_trach: 1, tube_feeds: 1, wound_care: 0,
  },

  // ── Telemetry (unit 3) — 18 cardiac / moderate-complexity patients ──
  {
    patient_id: "TELE-001", first_name: "Charles",  last_name: "Owens",
    gender: "M", icd_10: "I48.91", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 6,  high_risk_meds: 2, num_devices: 1, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-002", first_name: "Irene",    last_name: "Bradley",
    gender: "F", icd_10: "I50.9", unit: 3,
    continent: true, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 2, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-003", first_name: "Randall",  last_name: "Moore",
    gender: "M", icd_10: "I25.10", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 1, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-004", first_name: "Sylvia",   last_name: "Vargas",
    gender: "F", icd_10: "I48.2", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 7,  high_risk_meds: 2, num_devices: 1, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-005", first_name: "Gerald",   last_name: "Huang",
    gender: "M", icd_10: "I44.2", unit: 3,
    continent: true, independently_mobile: false,
    num_meds: 6,  high_risk_meds: 1, num_devices: 2, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-006", first_name: "Norma",    last_name: "Reeves",
    gender: "F", icd_10: "N18.6", unit: 3,
    continent: false, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 2, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-007", first_name: "Phillip",  last_name: "Stone",
    gender: "M", icd_10: "I21.4", unit: 3,
    continent: true, independently_mobile: false,
    num_meds: 10, high_risk_meds: 3, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-008", first_name: "Agnes",    last_name: "Kowalski",
    gender: "F", icd_10: "E11.65", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 1, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-009", first_name: "Reginald", last_name: "Watts",
    gender: "M", icd_10: "I47.1", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 4,  high_risk_meds: 1, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-010", first_name: "Dolores",  last_name: "Santiago",
    gender: "F", icd_10: "I50.33", unit: 3,
    continent: false, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 2, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-011", first_name: "Mitchell", last_name: "Grant",
    gender: "M", icd_10: "I10", unit: 3,
    continent: true, independently_mobile: true,
    num_meds: 3,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "TELE-012", first_name: "Vivian",   last_name: "Cross",
    gender: "F", icd_10: "I48.0", unit: 3,
    continent: true, independently_mobile: false,
    num_meds: 7,  high_risk_meds: 2, num_devices: 1, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },

  // ── PCU (unit 4) — 15 step-down patients ──
  {
    patient_id: "PCU-001", first_name: "Warren",   last_name: "Ellis",
    gender: "M", icd_10: "J18.9", unit: 4,
    continent: true, independently_mobile: false,
    num_meds: 7,  high_risk_meds: 1, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "PCU-002", first_name: "Edna",     last_name: "Crawford",
    gender: "F", icd_10: "I63.9", unit: 4,
    continent: false, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 2, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 1, wound_care: 0,
  },
  {
    patient_id: "PCU-003", first_name: "Edwin",    last_name: "Santos",
    gender: "M", icd_10: "J44.1", unit: 4,
    continent: true, independently_mobile: false,
    num_meds: 6,  high_risk_meds: 0, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "PCU-004", first_name: "Mildred",  last_name: "Hoffman",
    gender: "F", icd_10: "E11.9", unit: 4,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 1, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "PCU-005", first_name: "Clinton",  last_name: "Barnes",
    gender: "M", icd_10: "G35", unit: 4,
    continent: false, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 1, num_devices: 2, num_drips: 0,
    new_trach: 0, tube_feeds: 1, wound_care: 1,
  },
  {
    patient_id: "PCU-006", first_name: "Alberta",  last_name: "Strom",
    gender: "F", icd_10: "M32.9", unit: 4,
    continent: true, independently_mobile: false,
    num_meds: 8,  high_risk_meds: 2, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "PCU-007", first_name: "Franklin", last_name: "Tran",
    gender: "M", icd_10: "K57.32", unit: 4,
    continent: true, independently_mobile: false,
    num_meds: 6,  high_risk_meds: 1, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "PCU-008", first_name: "Hilda",    last_name: "Payne",
    gender: "F", icd_10: "I50.9", unit: 4,
    continent: false, independently_mobile: false,
    num_meds: 9,  high_risk_meds: 2, num_devices: 2, num_drips: 1,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },

  // ── Med-Surg (unit 5) — 20 lower-acuity patients ──
  {
    patient_id: "MS-001", first_name: "Raymond",  last_name: "Cooper",
    gender: "M", icd_10: "M16.9", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 4,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-002", first_name: "Judith",   last_name: "Perkins",
    gender: "F", icd_10: "K57.30", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 0, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-003", first_name: "Earl",     last_name: "Wagner",
    gender: "M", icd_10: "J44.1", unit: 5,
    continent: true, independently_mobile: false,
    num_meds: 6,  high_risk_meds: 0, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-004", first_name: "Shirley",  last_name: "Lamb",
    gender: "F", icd_10: "K40.90", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 4,  high_risk_meds: 0, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
  {
    patient_id: "MS-005", first_name: "Theodore", last_name: "Reid",
    gender: "M", icd_10: "Z96.641", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 3,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-006", first_name: "Lorraine",  last_name: "Quinn",
    gender: "F", icd_10: "N20.0", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 3,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-007", first_name: "Herman",   last_name: "Boyd",
    gender: "M", icd_10: "E11.9", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 1, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-008", first_name: "Pauline",  last_name: "Moss",
    gender: "F", icd_10: "M17.11", unit: 5,
    continent: true, independently_mobile: false,
    num_meds: 4,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-009", first_name: "Douglas",  last_name: "Harvey",
    gender: "M", icd_10: "I10", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 4,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-010", first_name: "Harriet",  last_name: "Armstrong",
    gender: "F", icd_10: "K92.1", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 5,  high_risk_meds: 1, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-011", first_name: "Stanley",  last_name: "Hunt",
    gender: "M", icd_10: "G43.909", unit: 5,
    continent: true, independently_mobile: true,
    num_meds: 3,  high_risk_meds: 0, num_devices: 0, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 0,
  },
  {
    patient_id: "MS-012", first_name: "Geraldine", last_name: "Dean",
    gender: "F", icd_10: "L97.209", unit: 5,
    continent: false, independently_mobile: false,
    num_meds: 6,  high_risk_meds: 0, num_devices: 1, num_drips: 0,
    new_trach: 0, tube_feeds: 0, wound_care: 1,
  },
];

// ─── Seed function ────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding Nursify demo database...");

  // Wipe existing data (order matters for FK constraints)
  await prisma.patient.deleteMany();
  await prisma.nurse.deleteMany();
  await prisma.unit.deleteMany();

  // Units
  for (const unit of UNITS) {
    await prisma.unit.create({ data: { id: unit.id, unit_name: unit.unit_name } });
  }
  console.log(`  Created ${UNITS.length} units.`);

  // Nurses — map legacy `unit` field to `unit_id`
  for (const nurse of NURSES) {
    await prisma.nurse.create({
      data: {
        nurse_name: nurse.nurse_name,
        years_exp: nurse.years_exp,
        unit_id: nurse.unit,
      },
    });
  }
  console.log(`  Created ${NURSES.length} nurses.`);

  // Patients — map legacy `unit` field to `unit_id`
  for (const patient of PATIENTS) {
    await prisma.patient.create({
      data: {
        patient_id:           patient.patient_id,
        first_name:           patient.first_name,
        last_name:            patient.last_name,
        gender:               patient.gender,
        icd_10:               patient.icd_10,
        continent:            patient.continent,
        independently_mobile: patient.independently_mobile,
        num_meds:             patient.num_meds,
        high_risk_meds:       patient.high_risk_meds,
        num_devices:          patient.num_devices,
        num_drips:            patient.num_drips,
        new_trach:            patient.new_trach,
        tube_feeds:           patient.tube_feeds,
        wound_care:           patient.wound_care,
        unit_id:              patient.unit,
      },
    });
  }
  console.log(`  Created ${PATIENTS.length} patients.`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
