const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const patients = require("./routes/api/patients");
const appointment = require("./routes/api/appointment");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//DB Configuration
const db = require("./config/keys").mongoURI;

//Connect to MongoDB
mongoose
    .connect(db,{ useNewUrlParser: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Password Config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users);
app.use("/api/patients", patients);
app.use("/api/appointment", appointment);


const port = process.env.port || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));