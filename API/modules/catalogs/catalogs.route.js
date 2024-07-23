let CatalogCtrl = require("./catalogs.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;

module.exports = (app, router) => {
    router.get("/api/v1/catalogs/profiles",[middlewareToken], CatalogCtrl.GetProfiles);
    router.get("/api/v1/catalogs/enterprises",[middlewareToken], CatalogCtrl.GetEnterprises);
    router.get("/api/v1/catalogs/clients",[middlewareToken], CatalogCtrl.GetClients);
    router.get("/api/v1/catalogs/banks",[middlewareToken], CatalogCtrl.GetBanks);
}