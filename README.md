# Welcome to Nursify.

This project was completed as a part of Springboard's software engineering bootcamp. Created by a nurse, it is the first iteration of a digital tool to make the nurse-patient assignment using clinical characteristics.

# Technical Development

This project is built with React, TypeScript, Bootstrap, and PostgreSQL. It uses libraries like react-router-dom and sequelize to handle client navigation and database migrations.

# User Flow

At first launch, the user can view a demo (which requires migrating the database) or sign in. If signing in, the user will be directed to a hospital data standard (managed by Epic's OAuth2 authentication servers). Credentialed access is as follows:
`username: FHIR`
`password: EpicFhir1!`

You may sign in and view initial data. Data rendered from this route is retrieved from Epic's Sandbox test data: the data is still fake data, but it is retrieved from Epic's API.

A user may choose to instead view the demo. The demo retrieves data from a database and uses a deterministic algorithm to make the patient assignment. The instructions for retrieving the demo data and setting up the demo database are below.

# Using the project

First run `npm install` to retrieve project dependencies. Then run `npx sequelize-cli db:create` in your command line to create the nursify database.
