const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
let ArchiveCtrl = require("./archives.ctrl");
let middlewareToken = require("./../../middlewares/auth.middleware").tokenValid;
var zip = require('express-zip');

module.exports = (app, router) => {
    router.post("/api/v1/archive/count",[middlewareToken], ArchiveCtrl.GetArchivesCount);
    router.post("/api/v1/archive/list",[middlewareToken], ArchiveCtrl.GetArchivesList);

    /*** Documents API ***/
    router.post("/api/v1/archive/zip", [middlewareToken], ArchiveCtrl.GenerateZip);
    router.get("/api/v1/archive/download-zip/:file", (req, res) => {
        console.log("req.params", req.params);
        console.log("req.query", req.query);
        let zipFile = req.params.file;
        const file = path.join((__dirname + '/../../public'), `${zipFile}`);
        res.download(file);
    });
}