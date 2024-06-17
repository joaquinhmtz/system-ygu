let express = require('express');
let app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const routes = require("./modules/routes")(app, router);
const PORT = process.env.PORT || 5001; 
let mongoose = require("mongoose");
let passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AccountSchema = require("./modules/models/account.scheme");
const session = require('express-session');
const dotenv = require('dotenv').config();
let errorHandler = require("./middlewares/errorHandler.middleware");

let uri = "mongodb://127.0.0.1:27017/ygu";

const connectDb = async () => {
    try {
        await mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log("Connected Db");
    } catch (error) {
        console.log(error);
    }
}

app.secret = process.env.SECRET;

passport.use(new LocalStrategy(AccountSchema.authenticate()));
passport.serializeUser(AccountSchema.serializeUser());
passport.deserializeUser(AccountSchema.deserializeUser());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SECRET,
    resave: false ,
    saveUninitialized: true ,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', router);
app.use(errorHandler.errorHandler);

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`); 
});

connectDb();
module.exports = app;