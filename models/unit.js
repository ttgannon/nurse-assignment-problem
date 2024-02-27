import { DataTypes } from "sequelize";
import { sequelize } from "../src/database/index.js";

export const UnitModel = sequelize.define("units", {
  unit_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: false
});


