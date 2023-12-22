import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../../models/index";

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  throw new Error(
    "Oops! There was a database error. Try connecting to the database again.",
  );
}

const Unit = sequelize.define("Units", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Nurse = sequelize.define("Nurses", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  years_exp: {
    type: DataTypes.STRING,
  },
});

const Patient = sequelize.define("Patients", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Unit.hasMany([Nurse, Patient]);
Nurse.belongsTo(Unit);
Patient.belongsTo(Unit);

try {
  console.log("Performing database check...");
  await sequelize.sync();
  console.log("Database check completed. Tables are ready to be populated.");
} catch (error) {
  console.error("Tables are not ready:", error);
  throw new Error(
    "Oops! There was a database error. Try connecting to the database again.",
  );
}
