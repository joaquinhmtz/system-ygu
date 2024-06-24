const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let ArchiveLib = require("./archives.lib");
let MovementLib = require("./../movements/movements.lib");

const GetArchivesCount = async (req, res, next) => {
    try {
        let data = req.body;
        let count = await ArchiveLib.GetCount(data);

        res.status(200).send({ success: true, total: count });

    } catch (e) {
        console.log("Error - GetArchivesCount: ", e);
        next(e);
    }
}

const GetArchivesList = async (req, res, next) => {
    try {
        let data = req.body;
        let archives = await ArchiveLib.GetList(data);

        res.status(200).send({ success: true, data: archives });

    } catch (e) {
        console.log("Error - GetArchivesList: ", e);
        next(e);
    }
}

const GenerateZip = async (req, res, next) => {
    try {
        let data = req.body;
        let files = [];
        let movement = await MovementLib.GetMovement(data);
        if (movement && movement.documents) {
            for (const [key, value] of Object.entries(movement.documents)) {
                if (value !== "") {
                    files.push(`${rootPath}public/${value}`);
                }
            } 
            if (movement.extraDocuments.length >= 1) {
                for (let i = 0; i < movement.extraDocuments.length; i++) files.push(`${rootPath}public/${movement.extraDocuments[i]}`);
            }
        }
        let zip = await ArchiveLib.GenerateFolderZip(files);

        res.status(200).send({ success: true, data: zip });

    } catch (e) {
        console.log("Error - GenerateZip: ", e);
        next(e);
    }
}

module.exports.GetArchivesCount = GetArchivesCount;
module.exports.GetArchivesList = GetArchivesList;
module.exports.GenerateZip = GenerateZip;