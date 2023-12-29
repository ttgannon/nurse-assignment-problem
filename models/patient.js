import { DataTypes } from "sequelize";
import { sequelize } from "../src/database/index.js";

export const PatientModel = sequelize.define("patients", {
  patient_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icd_10: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  continent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  independently_mobile: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  num_meds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  high_risk_meds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_devices: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  num_drips: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  new_trach: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tube_feeds: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  wound_care: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit: {
    type: DataTypes.INTEGER,
    allowNull: false,  
  }
});
