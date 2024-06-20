const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let MovementLib = require("./movements.lib");

const ReadXML = async (req, res, next) => {
    try {
        let fullPath = req.file.path;
        let data = await MovementLib.ReadFile(fullPath);
        let removeFile = await MovementLib.DeleteFile(fullPath);

        res.status(200).send({ success: true, data: data });

    } catch (e) {
        console.log("Error - ReadXML: ", e);
        next(e);
    }
}

const UploadFile = async (req, res, next) => {
    try {
        let fullPath = req.file.path;
        fullPath = fullPath.split("/API/public/");

        res.status(200).send({ success: true, data: fullPath[1] });

    } catch (e) {
        console.log("Error - UploadFile: ", e);
        next(e);
    }
}

const DeleteFile = async (req, res, next) => {
    try {
        let fullPath = req.body.path;
        fullPath = `${rootPath}public/` + fullPath;
        let dlt = await MovementLib.DeleteFile(fullPath);

        res.status(200).send({ success: true, message: "Archivo eliminado correctamente" });

    } catch (e) {
        console.log("Error - UploadFile: ", e);
        next(e);
    }
}

module.exports.ReadXML = ReadXML;
module.exports.UploadFile = UploadFile;
module.exports.DeleteFile = DeleteFile;