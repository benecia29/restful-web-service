const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect(
    "mongodb+srv://beneciacrasta29:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.1hodrcw.mongodb.net/"
);
mongoose.Promise = global.Promise;

//Displays the API route and the time it took to respond to the request in the terminal.
app.use(morgan('dev'));

//Makes the 'uploads' folder publicly available.
//First parameter helps to target requests only at '/uploads'.
app.use('/uploads', express.static('uploads'));

//Extracts JSON data and makes it readable. Allows only urlencoded data.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sends headers with the requests to prevent CORS (Cross-Origin Resource Sharing) errors. 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); //Allowing access to all web pages.
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    //Browser sends OPTIONS by default for POST and PUT requests to check what options we have.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next(); //If this fails, other routes can take over.
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.status = 404;
    next(error);  //Forwards the error request.
})

//Handles all other kinds of errors.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;