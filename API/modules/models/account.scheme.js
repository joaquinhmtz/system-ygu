let mongoose = require("mongoose");
let Scheme = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let AccountScheme = new Scheme({
    userId: { type: Scheme.Types.ObjectId, ref: "users" }
});

AccountScheme.plugin(passportLocalMongoose);
module.exports = mongoose.model("accounts", AccountScheme);