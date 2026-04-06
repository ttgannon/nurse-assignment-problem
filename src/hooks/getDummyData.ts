/* 

This file:
Queries database for nurses, patients, and units.

 */

import { useState } from "react";
import { Nurse, Patient, Unit } from "../interfaces";
import { faker } from "@faker-js/faker";

export async function getUnits() {
  try {
    const responseUnits = await fetch("http://localhost:3000/getUnits");
    if (!responseUnits.ok) {
      throw new Error(`Failed to fetch units. Status: ${responseUnits.status}`);
    }
    const units = await responseUnits.json();
    return units;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getNurses(unit?: number) {
  try {
    const headers = new Headers();
    if (unit) {
      headers.append("unit", String(unit));
    }
    const responseNurses = await fetch("http://localhost:3000/getNurses", {
      headers: headers,
    });
    const nurses = await responseNurses.json();
    return nurses;
  } catch (error) {
    console.error("Error fetching units:", error);
    return null;
  }
}

export async function getPatients(unit?: number) {
  try {
    const headers = new Headers();
    if (unit) {
      headers.append("unit", String(unit));
    }
    const response = await fetch("http://localhost:3000/getPatients", {
      headers: headers,
    });
    const patients = await response.json();
    return patients;
  } catch (error) {
    console.error("Error fetching units:", error);
    return null;
  }
}

export const useDummyData = () => {
  const [units] = useState<Unit[]>(() => {
    return Array.from({ length: 5 }, () => {
      const unit: Unit = {
        id: faker.number.int(),
        unit_name: faker.lorem.word(),
      };
      return unit;
    });
  });
  const [patients] = useState<Patient[]>(() => {
    return Array.from({ length: 60 }, () => {
      const patient: Patient = {
        id: faker.number.int(),
        patient_id: faker.string.uuid(),
        last_name: faker.person.lastName(),
        first_name: faker.person.firstName(),
        unit: faker.helpers.arrayElement(units).id.toString(),
        unitDetails: faker.helpers.arrayElement(units),
        acuityScore: 0,
        continent: faker.datatype.boolean(),
        independently_mobile: faker.datatype.boolean(),
        num_meds: faker.number.int({ min: 0, max: 10 }),
        high_risk_meds: faker.number.int({ min: 0, max: 5 }),
        num_devices: faker.number.int({ min: 0, max: 3 }),
        num_drips: faker.number.int({ min: 0, max: 2 }),
        new_trach: faker.number.int({ min: 0, max: 1 }),
        tube_feeds: faker.number.int({ min: 0, max: 1 }),
        wound_care: faker.number.int({ min: 0, max: 1 }),
      };
      return patient;
    });
  });
  const [nurses] = useState<Nurse[]>(() => {
    return Array.from({ length: 12 }, () => {
      const nurse: Nurse = {
        id: faker.number.int(),
        nurse_name: faker.person.fullName(),
        years_exp: faker.number.int({
          min: 0,
          max: 30,
        }),
        unit: faker.helpers.arrayElement(units).id,
        unitDetails: faker.helpers.arrayElement(units),
      };
      return nurse;
    });
  });

  return {
    units,
    patients,
    nurses,
  };
};
