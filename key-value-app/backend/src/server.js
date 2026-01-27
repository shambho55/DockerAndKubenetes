const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { healthRouter } = require("./routes/health");
const { keyValueRouter } = require("./routes/store");

const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use("/health",healthRouter);
app.use("/store",keyValueRouter);

const db_name = process.env.MONGODB_HOST;

console.log("Connecting to DB...");
mongoose.connect(`mongodb://${db_name}/${process.env.KEY_VALUE_DB}`,{
    auth: {
        username: process.env.KEY_VALUE_USER,
        password: process.env.KEY_VALUE_PASSWORD
        },
    connectTimeoutMS: 500
})
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        })
        console.log("Connected to DB");
    })
    .catch(err => {
        console.log("Something went wrong!!!");
        console.log(err);
    });
