let ProfileScheme = require("./../models/profiles.scheme");

const GetProfile = async (data) => {
    try {
        let profile = await ProfileScheme.findOne(data);

        return profile;

    } catch (e) {
        console.log("Err GetProfile: ", e);
        throw new Error(e);
    }
}

module.exports.GetProfile = GetProfile;