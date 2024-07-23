const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let MovementLib = require("./movements.lib");
let ClientLib = require("./../clients/clients.lib");
let BankLib = require("./../banks/banks.lib");
let EnterpriseLib = require("./../enterprises/enterprises.lib");
let GlobalUtils = require("./../utils/global.utils");

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

const SaveMovement = async (req, res, next) => {
    try {
        let data = req.body;
        console.log(data.invoice)
        if (data.invoice.typeInvoice === "CLIENTE (INGRESO)" || data.invoice.typeInvoice === "PROVEEDOR (EGRESO)") {
            console.log("aqui entraaa")
            let existClient = await ClientLib.GetClient({ rfc: data.client.rfc });
            if (existClient === null || data.newClient) {
                let client = await ClientLib.SaveClient(data.client);
                data.client["_id"] = client._id;
            }
        }
        if (data.newBank) {
            let existBank = await BankLib.GetBank({ name: data.bank.name.toUpperCase() });
            if (!existBank) {
                let bank = await BankLib.SaveBank(data.bank);
                data.bank["_id"] = bank._id;
            }
        }
        let existEnterprise = await EnterpriseLib.GetEnterprise({ rfc: data.enterprise.rfc });
        if (existEnterprise === null) {
            let enterprise = await EnterpriseLib.SaveEnterprise(data.enterprise);
            data.enterprise["_id"] = enterprise._id;
        }
        if (data.extraDocuments && data.extraDocuments.length >= 1) {
            let extraDocumentsTmp = [];
            data.extraDocuments.forEach(file => {
                extraDocumentsTmp.push(file.path);
            });
            data.extraDocuments = extraDocumentsTmp;
        }
        data["folio"] = await GlobalUtils.CreateFolio({ type: "movements" });
        let save = await MovementLib.SaveMovement(data);

        res.status(200).send({ success: true, message: "El registro fue guardado correctamente." });

    } catch (e) {
        console.log("Error - SaveMovement: ", e);
        next(e);
    }
}

module.exports.ReadXML = ReadXML;
module.exports.UploadFile = UploadFile;
module.exports.DeleteFile = DeleteFile;
module.exports.SaveMovement = SaveMovement;