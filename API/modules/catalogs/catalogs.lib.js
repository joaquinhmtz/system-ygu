let ProfileScheme = require("./../models/profiles.scheme");

const GetProfiles = async (data) => {
    try {
        let profiles = await ProfileScheme.find({},{ _id:1, name: 1 });

        return profiles;

    } catch (e) {
        console.log("Err GetProfiles: ", e);
        throw new Error(e);
    }
}

module.exports.GetProfiles = GetProfiles;