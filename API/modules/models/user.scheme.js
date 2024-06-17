let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let UserScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    lastname: { type: String, trim: true, uppercase: true },
    lastname2: { type: String, trim: true, uppercase: true },
    fullname: { type: String, trim: true, uppercase: true },
    email: { type: String, trim: true },
    username: { type: String, trim: true, unique: true },
    profile: { 
        _id: { type: Scheme.Types.ObjectId },
        name: { type: String, uppercase: true }
    },
    creationDate: { type: Date, default: Date.now() },
    active: { type: Boolean, default: true }
});

UserScheme.pre('save', function (next) {
    var fullName = "";
    if (this.name != '') fullName += this.name;
    if (this.lastname != '') fullName += ' ' + this.lastname;
    if (this.lastname2 != '') fullName += ' ' + this.lastname2;
    this.fullname = fullName;
    next();
});

module.exports = mongoose.model("Users", UserScheme);