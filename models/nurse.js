import { DataTypes } from "sequelize";
import { sequelize } from "../src/database/index.js";

export const NurseModel = sequelize.define("nurses", {
  nurse_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  years_exp: {
    type: DataTypes.INTEGER,
  },
  unit: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false
});
