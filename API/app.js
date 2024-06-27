let express = require('express');
let app = express();
const router = express.Router();
const cors = require('cors');
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

//let uri = "mongodb://127.0.0.1:27017/ygu";
let uri = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}`+ `@cluster0.1rhhhez.mongodb.net/${process.env.MONGODB}?retryWrites=true&w=majority&appName=${process.env.Cluster0}`

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
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
app.use(cors());

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: process.env.SECRET,
    resave: false ,
    saveUninitialized: true ,
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('showStackError', true);
app.use('/', router);
app.use(express.static(__dirname + '/public'));
app.use(express["static"](__dirname + "/public/client"));
app.use(errorHandler.errorHandler);

app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`); 
});

connectDb();
module.exports = app;