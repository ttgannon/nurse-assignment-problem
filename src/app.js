import express from 'express';
import { sequelize } from '../models/index.js';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



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