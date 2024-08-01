let TypesOfTaxScheme = require("./../models/typeOfTax.scheme");
let EntitiesScheme = require("./../models/entities.scheme");

const GetTypeOfTax = async (data) => {
    try {
        let type = await TypesOfTaxScheme.findOne(data);

        return type;

    } catch (e) {
        console.log("Err GetTypeOfTax: ", e);
        throw new Error(e);
    }
}

const SaveTypeOfTax = async (data) => {
    try {
        let type = new TypesOfTaxScheme(data);
        let save = await type.save();

        return save;

    } catch (e) {
        console.log("Err SaveTypeOfTax: ", e);
        throw new Error(e);
    }
}

const GetEntity = async (data) => {
    try {
        let type = await EntitiesScheme.findOne(data);

        return type;

    } catch (e) {
        console.log("Err GetEntity: ", e);
        throw new Error(e);
    }
}

const SaveEntity = async (data) => {
    try {
        let entity = new EntitiesScheme(data);
        let save = await entity.save();

        return save;

    } catch (e) {
        console.log("Err SaveEntity: ", e);
        throw new Error(e);
    }
}

module.exports.GetTypeOfTax = GetTypeOfTax;
module.exports.SaveTypeOfTax = SaveTypeOfTax;
module.exports.GetEntity = GetEntity;
module.exports.SaveEntity = SaveEntity;