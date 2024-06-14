let UserRoute = require("./users/users.route");
let AuthRoute = require("./auth/auth.route");
let CatalogRoute = require("./catalogs/catalogs.route");

module.exports = (app, router) => {
    UserRoute(app, router);
    AuthRoute(app, router);
    CatalogRoute(app, router);
};