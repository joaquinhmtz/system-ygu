let EnterpriseScheme = require("./../models/enterprise.scheme");

const GetEnterprise = async (data) => {
    try {
        let enterprise = await EnterpriseScheme.findOne(data);

        return enterprise;

    } catch (e) {
        console.log("Err GetEnterprise: ", e);
        throw new Error(e);
    }
}

const SaveEnterprise = async (data) => {
    try {
        let enterprise = new EnterpriseScheme(data);
        let save = await enterprise.save();

        return save;

    } catch (e) {
        console.log("Err SaveEnterprise: ", e);
        throw new Error(e);
    }
}

module.exports.GetEnterprise = GetEnterprise;
module.exports.SaveEnterprise = SaveEnterprise;