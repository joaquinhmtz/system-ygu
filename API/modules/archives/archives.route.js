const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let ArchiveCtrl = require("./archives.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${rootPath}/public/uploads/documents/`)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const uploadMissingFile = multer({ storage });

module.exports = (app, router) => {
    router.post("/api/v1/archive/count",[middlewareToken], ArchiveCtrl.GetArchivesCount);
    router.post("/api/v1/archive/list",[middlewareToken], ArchiveCtrl.GetArchivesList);
    router.post("/api/v1/archive/missing-file",[middlewareToken], uploadMissingFile.single('uploadMissingFile'), ArchiveCtrl.UploadMissingFile);

    /*** Documents API ***/
    router.post("/api/v1/archive/zip", [middlewareToken], ArchiveCtrl.GenerateZip);
    router.get("/api/v1/archive/download-zip/:file", (req, res) => {
        let zipFile = req.params.file;
        const file = path.join((__dirname + '/../../public'), `${zipFile}`);
        res.download(file);
    });
    router.get("/api/v1/archive/download/:file", (req, res) => {
        let excelFile = req.params.file;
        const file = path.join((__dirname + '/../../public/static/reports'), `${excelFile}`);
        res.download(file);
    });
    router.post("/api/v1/archive/report", [middlewareToken], ArchiveCtrl.GenerateReport);
}