const path = require('path');
const rootPath = path.normalize(__dirname + '/../../');
const JSZip = require('jszip');
let fs = require('fs');
let ArchiveScheme = require("./../models/movement.scheme");
let ArchiveUtils = require("./archives.utils");
let GlobalUtils = require("./../utils/global.utils");

const GetCount = async (data) => {
    try {
        let query = ArchiveUtils.GetQuery(data.filters);
        let count = await ArchiveScheme.find(query).countDocuments();

        return count;

    } catch (e) {
        console.log("Err GetCount: ", e);
        throw new Error(e);
    }
}

const GetList = async (data) => {
    try {
        let query = ArchiveUtils.GetQuery(data.filters);
        let pagination = GlobalUtils.GetQueryPager(data.pagination);
        let pipeline = [];

        pipeline.push({ $match: query });
        pipeline.push({ $sort : { "folio": -1 } });
        pipeline.push({
            $project: {
                enterprise: 1,
                client: 1,
                folio: 1,
                invoice: 1,
                "documents.invoiceXML": { $cond:{ if: {  $or: [ { $eq : ["$documents.invoiceXML", ""] }, { $eq : ["$documents.invoiceXML", null] } ], }, then: 0, else: "$documents.invoiceXML", } },
                "documents.invoicePDF": { $cond:{ if: {  $or: [ { $eq : ["$documents.invoicePDF", ""] }, { $eq : ["$documents.invoicePDF", null] } ], }, then: 0, else: "$documents.invoicePDF", } },
                "documents.voucherOfPayment": { $cond:{ if: {  $or: [ { $eq : ["$documents.voucherOfPayment", ""] }, { $eq : ["$documents.voucherOfPayment", null] } ], }, then: 0, else: "$documents.voucherOfPayment", } },
                "documents.partialXML": { $cond:{ if: {  $or: [ { $eq : ["$documents.partialXML", ""] }, { $eq : ["$documents.partialXML", null] } ], }, then: 0, else: "$documents.partialXML", } },
                "documents.partialPDF": { $cond:{ if: {  $or: [ { $eq : ["$documents.partialPDF", ""] }, { $eq : ["$documents.partialPDF", null] } ], }, then: 0, else: "$documents.partialPDF", } },
                total: 1,
                paymentMethod: 1,
                creationDate: 1
            }
        });
        pipeline.push({
            $skip: pagination.limit * (pagination.skip - 1)
        });
        pipeline.push({
            $limit: pagination.limit
        });

        let archives = await ArchiveScheme.aggregate(pipeline);

        return archives;

    } catch (e) {
        console.log("Err GetList: ", e);
        throw new Error(e);
    }
}

const GenerateFolderZip = async (data) => {
    try {
        const zip = new JSZip();
        let today = Date.now();

        for (let i = 0; i < data.length; i++) {
            let nameFile = data[i].split("uploads/documents/")[1];
            let file = fs.readFileSync(data[i]);
            zip.file(nameFile, file);
        }

        zip.generateAsync({type:"nodebuffer"}).then(function(content) {
            fs.writeFileSync(`${rootPath}public/${today}.zip`, content);
        });

        return `${today}.zip`;

    } catch (e) {
        console.log("Err GenerateFolderZip: ", e);
        throw new Error(e);
    }
}

module.exports.GetCount = GetCount;
module.exports.GetList = GetList;
module.exports.GenerateFolderZip = GenerateFolderZip;