import express from 'express';
import { sequelize } from './database/index.js';
import { NurseModel, PatientModel, UnitModel } from "../models/index.js";
import cors from "cors"

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Sequelize */

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
  sequelize.sync({ alter: true })
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
NurseModel.belongsTo(UnitModel, { foreignKey: 'unit', as: "unitDetails" });
PatientModel.belongsTo(UnitModel, {foreignKey: 'unit', as: "unitDetails"})
UnitModel.hasMany(PatientModel, {
  foreignKey: 'unit'
});

UnitModel.hasMany(NurseModel, {
  foreignKey: 'unit'
});


  /* Routes */
app.get('/getNurses', async (req, res) => {
  let nurses;
  if (req.headers.unit) {
    nurses = await NurseModel.findAll({
      where: {
        'unit': req.headers.unit,
      },
      include: { model: UnitModel, as: 'unitDetails' },
    });  
    // console.log("hello" + nurses[0].unit.unit_name)
    return res.send(nurses);
  } else {
    nurses = await NurseModel.findAll();
    return res.send(nurses);
  }
  
})

app.get('/getUnits', async (req, res) => {
  const units = await UnitModel.findAll();
  res.send(units);
})

app.get('/getPatients', async (req, res) => {
  let patients;
  if (req.headers.unit) {
    patients = await PatientModel.findAll({
      where: {
        unit: req.headers.unit
      }
    }, {
      limit: 40
    });  
    return res.send(patients);
  } else {
    patients = await PatientModel.findAll();
    return res.send(patients);
  }
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