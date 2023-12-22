"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var index_1 = require("../../models/index");

async function initiateDatabase () {
    try {
        await index_1.sequelize.authenticate();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
        throw new Error("Oops! There was a database error. Try connecting to the database again.");
    }
    var Unit = index_1.sequelize.define("Units", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    });
    var Nurse = index_1.sequelize.define("Nurses", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        years_exp: {
            type: sequelize_1.DataTypes.STRING,
        },
    });
    var Patient = index_1.sequelize.define("Patients", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    });
    Unit.hasMany([Nurse, Patient]);
    Nurse.belongsTo(Unit);
    Patient.belongsTo(Unit);
    try {
        console.log("Performing database check...");
        await index_1.sequelize.sync();
        console.log("Database check completed. Tables are ready to be populated.");
    }
    catch (error) {
        console.error("Tables are not ready:", error);
        throw new Error("Oops! There was a database error. Try connecting to the database again.");
    }
    
}
initiateDatabase();