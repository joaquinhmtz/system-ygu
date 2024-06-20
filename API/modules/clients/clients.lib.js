let ClientScheme = require("./../models/client.scheme");

const GetClient = async (data) => {
    try {
        let client = await ClientScheme.findOne(data);

        return client;

    } catch (e) {
        console.log("Err GetClient: ", e);
        throw new Error(e);
    }
}

const SaveClient = async (data) => {
    try {
        let client = new ClientScheme(data);
        let save = await client.save();

        return save;

    } catch (e) {
        console.log("Err SaveClient: ", e);
        throw new Error(e);
    }
}

module.exports.GetClient = GetClient;
module.exports.SaveClient = SaveClient;