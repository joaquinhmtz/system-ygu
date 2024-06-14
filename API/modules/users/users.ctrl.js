let UserLib = require("./users.lib");
let AccountLib = require("./../auth/auth.lib");
let regExpPass = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%*.]).{8,}$/;

const SaveUser = async (req, res, next) => {
    try {
        let data = req.body;
        let existUser = await UserLib.GetUser({ username: data.username });
        if (existUser && existUser.username) res.status(500).json({ success: false, message: 'El nombre de usuario ya está registrado en el sistema' });
        else {
            let validatePass = regExpPass.test(data.password);
            if (!validatePass) res.status(500).json({  success: false, message: 'La contraseña no cumple con el formato establecido' });
            else {
                let save = await UserLib.SaveUser(data);
                data["userId"] = save._id;
                let account = await AccountLib.SaveAccount(data);
                res.status(201).send({ success: true, message: 'El usuario fue creado correctamente.' });
            }
        }

    } catch (e) {
        console.log("Error - SaveUser: ", e);
        next(e);
    }
}

const ValidateUsername = async (req, res, next) => {
    try {
        let data = req.query;
        let existUser = await UserLib.GetUser({ username: data.username });
        
        if (existUser && existUser.username) res.status(200).send({ unique: false })
        else res.status(201).send({ unique: true });

    } catch (e) {
        console.log("Error - ValidateUsername: ", e);
        next(e);
    }
}

const GetUsersCount = async (req, res, next) => {
    try {
        let data = req.body;
        let count = await UserLib.GetCount(data);

        res.status(200).send({ success: true, total: count });

    } catch (e) {
        console.log("Error - GetUsersCount: ", e);
        next(e);
    }
}

const GetUsersList = async (req, res, next) => {
    try {
        let data = req.body;
        let users = await UserLib.GetList(data);

        res.status(200).send({ success: true, data: users });

    } catch (e) {
        console.log("Error - GetUsersList: ", e);
        next(e);
    }
}

module.exports.SaveUser = SaveUser;
module.exports.ValidateUsername = ValidateUsername;
module.exports.GetUsersCount = GetUsersCount;
module.exports.GetUsersList = GetUsersList;