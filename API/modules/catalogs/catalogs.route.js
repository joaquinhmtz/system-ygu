let CatalogCtrl = require("./catalogs.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;

module.exports = (app, router) => {
    router.get("/api/v1/catalogs/profiles",[middlewareToken], CatalogCtrl.GetProfiles);
}