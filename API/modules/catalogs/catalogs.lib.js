let ProfileScheme = require("./../models/profiles.scheme");
let EnterpriseScheme = require("./../models/enterprise.scheme");
let ClientScheme = require("./../models/client.scheme");
let BankScheme = require("./../models/bank.scheme");
let TypesOfTaxScheme = require("./../models/typeOfTax.scheme");
let EntitiesScheme = require("./../models/entities.scheme");

const GetProfiles = async (data) => {
    try {
        let profiles = await ProfileScheme.find({},{ _id:1, name: 1 });

        return profiles;

    } catch (e) {
        console.log("Err GetProfiles: ", e);
        throw new Error(e);
    }
}

const GetEnterprises = async (data) => {
    try {
        let enterprises = await EnterpriseScheme.find({},{ _id: 1, rfc: 1, name: 1 });

        return enterprises;

    } catch (e) {
        console.log("Err GetEnterprises: ", e);
        throw new Error(e);
    }
}

const GetClients = async (data) => {
    try {
        let clients = await ClientScheme.find({},{ _id:1, name: 1, rfc: 1, cfdi: 1 });

        return clients;

    } catch (e) {
        console.log("Err GetClients: ", e);
        throw new Error(e);
    }
}

const GetBanks = async (data) => {
    try {
        let banks = await BankScheme.find({});

        return banks;

    } catch (e) {
        console.log("Err GetBanks: ", e);
        throw new Error(e);
    }
}

const GetTypeOfTaxList = async (data) => {
    try {
        let types = await TypesOfTaxScheme.find({}, { creationDate: 0 });

        return types;

    } catch (e) {
        console.log("Err GetTypeOfTaxList: ", e);
        throw new Error(e);
    }
}

const GetEntities = async (data) => {
    try {
        let types = await EntitiesScheme.find({});

        return types;

    } catch (e) {
        console.log("Err GetEntities: ", e);
        throw new Error(e);
    }
}

module.exports.GetProfiles = GetProfiles;
module.exports.GetEnterprises = GetEnterprises;
module.exports.GetClients = GetClients;
module.exports.GetBanks = GetBanks;
module.exports.GetTypeOfTaxList = GetTypeOfTaxList;
module.exports.GetEntities = GetEntities;