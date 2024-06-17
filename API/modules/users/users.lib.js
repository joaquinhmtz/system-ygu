let UserScheme = require("./../models/user.scheme");
let UserUtils = require("./users.utils");
let GlobalUtils = require("./../utils/global.utils");

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

const GetCount = async (data) => {
    try {
        let query = UserUtils.GetQuery(data.filters);
        let count = await UserScheme.find(query).countDocuments();

        return count;

    } catch (e) {
        console.log("Err GetCount: ", e);
        throw new Error(e);
    }
}

const GetList = async (data) => {
    try {
        let query = UserUtils.GetQuery(data.filters);
        let pagination = GlobalUtils.GetQueryPager(data.pagination);
        let users = await UserScheme.find(query).skip((pagination.skip - 1) * pagination.limit).limit(pagination.limit).sort({fullname:1});

        return users;

    } catch (e) {
        console.log("Err GetList: ", e);
        throw new Error(e);
    }
}

module.exports.GetUser = GetUser;
module.exports.SaveUser = SaveUser;
module.exports.GetCount = GetCount;
module.exports.GetList = GetList;