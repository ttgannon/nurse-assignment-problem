import { useState } from "react";
import { Nurse, Patient, Unit } from "../interfaces";
import { faker } from "@faker-js/faker";

export const useDummyData = () => {
  const [units] = useState<Unit[]>(() =>
    Array.from({ length: 3 }, () => {
      const unit: Unit = {
        id: faker.number.int(),
        name: faker.lorem.word(),
      };
      return unit;
    }),
  );
  const [patients] = useState<Patient[]>(() => {
    return Array.from({ length: 10 }, () => {
      const patient: Patient = {
        id: faker.number.int(),
        fullName: faker.person.fullName(),
        unitId: faker.helpers.arrayElement(units).id,
      };
      return patient;
    });
  });
  const [nurses] = useState<Nurse[]>(() => {
    return Array.from({ length: 10 }, () => {
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
