import { useState } from "react";
import { Nurse, Patient, Unit } from "../interfaces";
import { faker } from "@faker-js/faker";

/* Need to edit this file to:
TODO:
 - Query database for list of units in the database;
 a unit is an id and a name with reference to patients and nurses 



 */

export async function getUnits() {
  const responseUnits = await fetch("http://localhost:3000/getUnits");
  const units = await responseUnits.json();
  console.log(units);
  return units;
  // try {
  //   const responseUnits = await fetch("https://localhost:3000/");

  //   if (!responseUnits.ok) {
  //     throw new Error(`Failed to fetch units. Status: ${responseUnits.status}`);
  //   }

  //   const units = await responseUnits.json();
  //   console.log(units + "+++++++++");
  //   return units;
  // } catch (error) {
  //   console.error("Error fetching units:", error);
  //   return null; // Return null or another suitable value indicating an error
  // }
}

//query a route to retrieve all the units
// export async function getDummyData() {
//   try {
//     const responseUnits = await fetch("https://localhost:3000/");
//     const units = await responseUnits.json();
//     console.log(units + "+++++++++");

//     const responseNurses = await fetch("https://localhost:3000/");
//     const nurses = await responseNurses.json();

//     const responsePatients = await fetch("https://localhost:3000/");
//     const patients = await responsePatients.json();

//     // const [units] = useState<Unit[]>(dbunits);
//     // const [nurses] = useState<Nurse[]>(dbnurses);
//     // const [patients] = useState<Patient[]>(dbpatients);

//     return { units, nurses, patients };
//   } catch (error) {
//     return "You done goofed." + error;
//   }
// }

/*
 TODO:
 - Query database for list of patients;
 a patient is an id, a name, and a unitid
 
 
 TODO:
 - Query database for list of nurses coming into the shift;
 a nurse is an id, a name, years of experience, and unit
*/

export async function getNurses(unit?: number) {
  const headers = new Headers();
  if (unit) {
    headers.append("unit", String(unit));
  }
  const responseNurses = await fetch("http://localhost:3000/getNurses", {
    headers: headers,
  });

  const nurses = await responseNurses.json();
  console.log(nurses);
  return nurses;
  // try {
  //   const responseUnits = await fetch("https://localhost:3000/");

  //   if (!responseUnits.ok) {
  //     throw new Error(`Failed to fetch units. Status: ${responseUnits.status}`);
  //   }

  //   const units = await responseUnits.json();
  //   console.log(units + "+++++++++");
  //   return units;
  // } catch (error) {
  //   console.error("Error fetching units:", error);
  //   return null; // Return null or another suitable value indicating an error
  // }
}

export async function getPatients(unit?: number) {
  const headers = new Headers();
  if (unit) {
    headers.append("unit", String(unit));
  }
  const response = await fetch("http://localhost:3000/getPatients", {
    headers: headers,
  });

  const patients = await response.json();
  console.log(patients);
  return patients;
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
