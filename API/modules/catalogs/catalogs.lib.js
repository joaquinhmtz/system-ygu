let ProfileScheme = require("./../models/profiles.scheme");
let EnterpriseScheme = require("./../models/enterprise.scheme");
let ClientScheme = require("./../models/client.scheme");

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

module.exports.GetProfiles = GetProfiles;
module.exports.GetEnterprises = GetEnterprises;
module.exports.GetClients = GetClients;