let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let TypesOfTaxScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    creationDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("TypesOfTax", TypesOfTaxScheme);