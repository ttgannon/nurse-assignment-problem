/* This file determines which database to use and initializes a sequelize instance. It runs on server start.
*/

"use strict";

import { Sequelize } from "sequelize";

// import fs from "fs";
// import path from "path";
// import process from "process";
/*  this import below isn't working --> */
// import { setupDatabase } from "../../src/database/sequelize";

// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || "development";
// const config = require(__dirname + "/../config/config.json")[env];

export const sequelize = new Sequelize({
  dialect: 'postgres',
  storage: 'postgres://nursify'
});

// if (sequelize) {
//   await setupDatabase(sequelize.config.database);
// }

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
  sequelize.sync()
  .then(() => {
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

// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf(".") !== 0 &&
//       file !== basename &&
//       file.slice(-3) === ".js" &&
//       file.indexOf(".test.js") === -1
//     );
//   })
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes,
//     );
//     db[model.name] = model;
//   });

// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
