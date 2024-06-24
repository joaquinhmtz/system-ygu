let UserRoute = require("./users/users.route");
let AuthRoute = require("./auth/auth.route");
let CatalogRoute = require("./catalogs/catalogs.route");
let MovementRoute = require("./movements/movements.route");
let ArchiveRoute = require("./archives/archives.route");

module.exports = (app, router) => {
    UserRoute(app, router);
    AuthRoute(app, router);
    CatalogRoute(app, router);
    MovementRoute(app, router);
    ArchiveRoute(app, router);
};