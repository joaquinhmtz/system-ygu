let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let ProfileScheme = new Scheme({
    name: { type: String, trim: true, uppercase: true },
    description: { type: String, trim: true, uppercase: true },
    permissions	: [{
		module: { type : String, trim : true, uppercase : true },
		moduleId: { type : Number, default: 0 },
		isSelected: {	type : Boolean },
		privileges: [{
			name: { type : String, trim: true },
			method: { type : String, trim: true },
			active: { type : Boolean }
		}]
	}]
});

module.exports = mongoose.model("Profiles", ProfileScheme);