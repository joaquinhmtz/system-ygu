let UserRoute = require("./users/users.route");
let AuthRoute = require("./auth/auth.route");

module.exports = (app, router) => {
    UserRoute(app, router);
    AuthRoute(app, router);
};