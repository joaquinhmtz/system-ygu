let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let EnterpriseScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    rfc: { type: String, trim: true, uppercase: true },
    cfdi: { type: String, trim: true, uppercase: true },
    creationDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Enterprises", EnterpriseScheme);