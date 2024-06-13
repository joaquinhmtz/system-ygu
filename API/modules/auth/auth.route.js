let passport = require('passport');
let jwt = require('jsonwebtoken');
let UserLib = require("./../users/users.lib");

module.exports = (app, router) => {
    router.post("/v1/login", (req, res, next) => {
        return passport.authenticate("local", async (err, account, info) => {
            if (account) {
                if (account && account.userId) {
                    let user = await UserLib.GetUser({ _id: account.userId });

                    if (user) {
                        let token = jwt.sign(user.toJSON(), app.secret, { expiresIn : "1d" });
                        
                        return res.status(200).send({ succes: true, token: token, user: user });

                    } else res.status(401).json({ message: "No se encontró información del usuario" });
                }
            } else res.status(401).json({ message: "No existe la cuenta" });
        })(req, res, next)
    });
}