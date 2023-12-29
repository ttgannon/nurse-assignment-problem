import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

export const Nurse = sequelize.define("Nurses", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  years_exp: {
    type: DataTypes.STRING,
  },
});
