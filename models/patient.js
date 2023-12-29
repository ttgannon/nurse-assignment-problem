import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Patient = sequelize.define("Patients", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
