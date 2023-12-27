import express from 'express';

export const app = express()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!')
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