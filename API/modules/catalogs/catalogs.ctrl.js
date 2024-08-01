let CatalogLib = require("./catalogs.lib");

const GetProfiles = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetProfiles(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetProfiles: ", e);
        next(e);
    }
}

const GetEnterprises = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetEnterprises(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetEnterprises: ", e);
        next(e);
    }
}

const GetClients = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetClients(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetClients: ", e);
        next(e);
    }
}

const GetBanks = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetBanks(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetBanks: ", e);
        next(e);
    }
}

const GetTypesOfTax = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetTypeOfTaxList(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetTypesOfTax: ", e);
        next(e);
    }
}

const GetEntities = async (req, res, next) => {
    try {
        let data = req.query;
        let results = await CatalogLib.GetEntities(data);

        res.status(200).send(results);

    } catch (e) {
        console.log("Error - GetEntities: ", e);
        next(e);
    }
}

module.exports.GetProfiles = GetProfiles;
module.exports.GetEnterprises = GetEnterprises;
module.exports.GetClients = GetClients;
module.exports.GetBanks = GetBanks;
module.exports.GetTypesOfTax = GetTypesOfTax;
module.exports.GetEntities = GetEntities;