const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
const multer = require('multer');
const upload = multer({ dest: `${rootPath}/public/uploads-xml/` });
const uploadFile = multer({ dest: `${rootPath}/public/uploads/documents/` });
let MovementCtrl = require("./movements.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;

module.exports = (app, router) => {
    /*** Documents API ***/
    router.post("/api/v1/movement/read-xml",[middlewareToken], upload.single('invoiceXml'), MovementCtrl.ReadXML);
    router.post("/api/v1/movement/upload-file", [middlewareToken], uploadFile.single('uploadFile'), MovementCtrl.UploadFile);
    router.post("/api/v1/movement/delete-file", [middlewareToken], MovementCtrl.DeleteFile)
}