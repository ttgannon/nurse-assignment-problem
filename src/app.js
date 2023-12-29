import express from 'express';
import { sequelize } from './database/index.js';
import { NurseModel, PatientModel, UnitModel } from "../models/index.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Sequelize */

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
  sequelize.sync()
  .then(async () => {
    console.log('Database synchronized');
  })
  .catch((error) => {
    console.error('Error synchronizing database:', error);
});
} catch (error) {
  console.error("Unable to connect to the database:", error);
  throw new Error(
    "Oops! There was a database error. Try connecting to the database again.",
  );
}

UnitModel.hasMany(PatientModel, {
  foreignKey: 'unit'
});

UnitModel.hasMany(NurseModel, {
  foreignKey: 'unit'
});


  /* Routes */
app.get('/', (req, res) => {
  res.send('Hello World!');
})

/** 404 handler */

app.use(function(req, res, next) {
    const err = new Error("Not Found", 404);
    return next(err);
  });
  
/** general error handler */
  
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.json({
        error: err,
        message: err.message
    });
});