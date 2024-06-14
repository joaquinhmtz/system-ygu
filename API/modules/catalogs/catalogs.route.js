let CatalogCtrl = require("./catalogs.ctrl");

module.exports = (app, router) => {
    router.get("/api/v1/catalogs/profiles", CatalogCtrl.GetProfiles);
}