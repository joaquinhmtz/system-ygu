let UserScheme = require("./../models/user.scheme");

const GetUser = async (data) => {
    try {
        let user = await UserScheme.findOne(data);

        return user;

    } catch (e) {
        console.log("Err GetUser: ", e);
        throw new Error(e);
    }
}

const SaveUser = async (data) => {
    try {
        let user = new UserScheme(data);
        let save = await user.save();

        return save;

    } catch (e) {
        console.log("Err SaveUser: ", e);
        throw new Error(e);
    }
}

module.exports.GetUser = GetUser;
module.exports.SaveUser = SaveUser;