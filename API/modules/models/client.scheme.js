let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let ClientScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    rfc: { type: String, trim: true, uppercase: true },
    cfdi: { type: String, trim: true, uppercase: true },
    type: { type: String, trim: true, uppercase: true },
    creationDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Clients", ClientScheme);