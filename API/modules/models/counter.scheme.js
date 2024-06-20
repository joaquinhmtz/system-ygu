let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CountersModel = new Schema({
    counter: { type: Number },                            
    type: { type: String },
    last_folio: { type : String, uppercase: true, trim: true }
});


module.exports = mongoose.model('Counters', CountersModel);