import request from "supertest";
import { app } from "../src/router"; // Update the import path as per your project structure
import { sequelize } from "../src/database/index"; // Update the import path as per your project structure
import { NurseModel, PatientModel, UnitModel } from "../models";

// Test suite for the Express router setup
describe("Express Router Setup", () => {
  // Test if the app is defined
  it("should define the app", () => {
    expect(app).toBeDefined();
  });

  // Test if the routes are set up correctly
  it("should respond with 200 for GET /getNurses", async () => {
    const response = await request(app).get("/getNurses");
    expect(response.status).toBe(200);
  });

  it("should respond with 200 for GET /getUnits", async () => {
    const response = await request(app).get("/getUnits");
    expect(response.status).toBe(200);
  });

  it("should respond with 200 for GET /getPatients", async () => {
    const response = await request(app).get("/getPatients");
    expect(response.status).toBe(200);
  });

  // Test Sequelize initialization, authentication, and database synchronization
  it("should authenticate Sequelize connection successfully", async () => {
    try {
      await sequelize.authenticate();
      expect(true).toBe(true); // Authentication successful
    } catch (error) {
      expect(error).toBeNull(); // Authentication failed
    }
  });

  it("should synchronize the database successfully", async () => {
    try {
      await sequelize.sync({ alter: true });
      expect(true).toBe(true); // Database synchronization successful
    } catch (error) {
      expect(error).toBeNull(); // Database synchronization failed
    }
  });

  it("should define relationships between NurseModel and UnitModel", async () => {
    const nurse = await NurseModel.findOne({
      include: { model: UnitModel, as: "unitDetails" },
    });
    expect(nurse).toBeDefined();
  });

  it("should define relationships between PatientModel and UnitModel", async () => {
    const patient = await PatientModel.findOne({
      include: { model: UnitModel, as: "unitDetails" },
    });
    expect(patient).toBeDefined();
  });
});
