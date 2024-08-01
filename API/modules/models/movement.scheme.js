let mongoose = require("mongoose");
let Scheme = mongoose.Schema;

let MovementScheme = new Scheme({
    folio: { type: String, trim: true },
    client: {
        _id: { type: Scheme.Types.ObjectId },
        name: { type: String, trim: true, uppercase: true },
        rfc: { type: String, trim: true, uppercase: true },
        cfdi: { type: String, trim: true, uppercase: true },
        type: { type: String, trim: true, uppercase: true },
    },
    enterprise: {
        _id: { type: Scheme.Types.ObjectId },
        name: { type: String, trim: true, uppercase: true },
        rfc: { type: String, trim: true, uppercase: true },
    },
    entity: { 
        _id: { type: Scheme.Types.ObjectId },
        name: { type: String, trim: true, uppercase: true }
    },
    bank: {
        _id: { type: Scheme.Types.ObjectId },
        name: { type: String, trim: true, uppercase: true }
    },
    observations: { type: String, trim: true, uppercase: true },
    paymentMethod: { type: String, trim: true, uppercase: true },
    typeReceipt: { type: String, trim: true, uppercase: true },
    total: { type: Number, default: 0 },
    invoice: {
        invoiceDate: { type: Date },
        invoiceFolio: { type: String, trim: true, uppercase: true },
        methodOfPayment: { type: String, trim: true, uppercase: true },
        typeInvoice: { type: String, trim: true, uppercase: true },
        nameMovement: { type: String, trim: true, uppercase: true },
        statementMonth: { type: String, trim: true, uppercase: true },
        typeOfTax: { type: String, trim: true, uppercase: true }
    },
    documents: {
        invoiceXML: { type: String, trim: true },
        invoicePDF: { type: String, trim: true },
        voucherOfPayment: { type: String, trim: true },
        partialXML: { type: String, trim: true },
        partialPDF: { type: String, trim: true },
        documentStatementPDF: { type: String, trim: true },
        paymentDocumentPDF: { type: String, trim: true },
        calculingDocumentPDF: { type: String, trim: true }
    },
    extraDocuments: [{ type: String, trim: true }],
    user: {
        _id: { type: Scheme.Types.ObjectId },
        fullname: { type: String, trim: true, uppercase: true },
    },
    creationDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Movements", MovementScheme);