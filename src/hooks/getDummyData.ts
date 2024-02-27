import { useState } from "react";
import { Nurse, Patient, Unit } from "../interfaces";
import { faker } from "@faker-js/faker";

/* This file:
Queries database for nurses, patients, and units.
 */

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
        name: faker.lorem.word(),
        patients: [],
        nurses: [],
      };
      return unit;
    });
  });
  const [patients] = useState<Patient[]>(() => {
    return Array.from({ length: 60 }, () => {
      const patient: Patient = {
        id: faker.number.int(),
        fullName: faker.person.fullName(),
        unitId: faker.helpers.arrayElement(units).id,
      };
      return patient;
    });
  });
  const [nurses] = useState<Nurse[]>(() => {
    return Array.from({ length: 12 }, () => {
      const nurse: Nurse = {
        employeeId: faker.number.int(),
        fullName: faker.person.fullName(),
        yearsOfExperience: faker.number.int({
          min: 0,
          max: 30,
        }),
        unitId: faker.helpers.arrayElement(units).id,
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
