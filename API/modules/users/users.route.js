let UserCtrl = require("./users.ctrl");

module.exports = (app, router) => {
    router.post("/api/v1/users/save", UserCtrl.SaveUser);
    router.get("/api/v1/users/validate-username", UserCtrl.ValidateUsername);
}