let UserLib = require("./users.lib");
let AccountLib = require("./../auth/auth.lib");
let regExpPass = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!@#$%*.]).{8,}$/;

const SaveUser = async (req, res) => {
    try {
        let data = req.body;
        console.log("Todo bien", data);
        let existUser = await UserLib.GetUser({ username: data.username });
        if (existUser && existUser.username) res.status(500).json({ success: false, message: 'El nombre de usuario ya está registrado en el sistema' });
        else {
            let validatePass = regExpPass.test(data.password);
            if (!validatePass) res.status(500).json({  success: false, message: 'La contraseña no cumple con el formato establecido' });
            else {
                let save = await UserLib.SaveUser(data);
                console.log("save**", save);
                data["userId"] = save._id;
                let account = await AccountLib.SaveAccount(data);
                res.status(201).send({ success: true, message: 'El usuario fue creado correctamente.' });
            }
        }

    } catch (e) {
        console.log("Error - SaveUser: ", e);
        res.status(500).json({ msg: e.toString() });
    }
}

module.exports.SaveUser = SaveUser;