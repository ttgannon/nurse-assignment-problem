import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";
import { Nurse } from "./nurse.js";
import { Patient } from "./patient.js";

export const Unit = sequelize.define("Units", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Unit.hasMany([Nurse, Patient]);
Nurse.belongsTo(Unit);
Patient.belongsTo(Unit);
