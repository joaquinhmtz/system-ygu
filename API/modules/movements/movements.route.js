const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
const multer = require('multer');
const upload = multer({ dest: `${rootPath}/public/uploads-xml/` });
//const uploadFile = multer({ dest: `${rootPath}/public/uploads/documents/` });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${rootPath}/public/uploads/documents/`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const uploadFile = multer({ storage });
let MovementCtrl = require("./movements.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;

module.exports = (app, router) => {
    /*** Documents API ***/
    router.post("/api/v1/movement/read-xml",[middlewareToken], upload.single('invoiceXml'), MovementCtrl.ReadXML);
    router.post("/api/v1/movement/upload-file", [middlewareToken], uploadFile.single('uploadFile'), MovementCtrl.UploadFile);
    router.post("/api/v1/movement/delete-file", [middlewareToken], MovementCtrl.DeleteFile);

    /*** Register API ***/
    router.post("/api/v1/movement/save", [middlewareToken], MovementCtrl.SaveMovement);
}