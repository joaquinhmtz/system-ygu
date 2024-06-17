const GetQuery = (data) => {
    let query = {};

    if (data.username) query["username"] = new RegExp(data.username, "i");
    if (data.fullname) query["fullname"] = new RegExp(data.fullname, "i");
    query["active"] = data.status;

    return query;
}

module.exports.GetQuery = GetQuery;