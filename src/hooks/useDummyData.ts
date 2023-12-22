import { useState } from "react";
import { Nurse, Patient, Unit } from "../interfaces";
import { faker } from "@faker-js/faker";

/* Need to edit this file to:
TODO:
 - Query database for list of units in the database;
 a unit is an id and a name with reference to patients and nurses 



 TODO:
 - Query database for list of patients;
 a patient is an id, a name, and a unitid
 
 
 TODO:
 - Query database for list of nurses coming into the shift;
 a nurse is an id, a name, years of experience, and unit

*/

export const useDummyData = () => {
  const [units] = useState<Unit[]>(() =>
    Array.from({ length: 5 }, () => {
      const unit: Unit = {
        id: faker.number.int(),
        name: faker.lorem.word(),
        patients: [],
        nurses: [],
      };
      return unit;
    }),
  );
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
