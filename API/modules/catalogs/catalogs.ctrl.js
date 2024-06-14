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

module.exports.GetProfiles = GetProfiles;