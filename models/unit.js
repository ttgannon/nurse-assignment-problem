import { DataTypes } from "sequelize";
import { sequelize } from "../src/database/index.js";
// import { Nurse } from "./nurse.js";
// import { Patient } from "./patient.js";

export const UnitModel = sequelize.define("units", {
  unit_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Unit.hasMany([Nurse, Patient]);
// Nurse.belongsTo(Unit);
// Patient.belongsTo(Unit);
