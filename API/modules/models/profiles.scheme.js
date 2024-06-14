let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let ProfileScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    description: { type: String, trim: true, uppercase: true },
});

module.exports = mongoose.model("Profiles", ProfileScheme);