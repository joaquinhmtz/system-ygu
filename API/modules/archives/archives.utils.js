const GetQuery = (data) => {
    let query = {};

    if (data.enterprise) {
        query['$or'] = [
            { 'enterprise.name': new RegExp(data.enterprise, 'i') }, 
            { 'enterprise.rfc': new RegExp(data.enterprise, 'i') }
        ];
    }  

    if (data.client) {
        query['$or'] = [
            { 'client.name': new RegExp(data.client, 'i') }, 
            { 'client.rfc': new RegExp(data.client, 'i') }
        ];
    } 

    if (data.typeInvoice) {
        query["invoice.typeInvoice"] = data.typeInvoice;
    } 

    if (data.type) {
        query["client.type"] = data.type;
    } 

    if (data.initDate && !data.endDate) {
        let initDate = new Date(data.initDate);
        query["invoice.invoiceDate"] = { $gte: initDate };
    } else if (data.initDate && data.endDate) {
        let initDate = new Date(data.initDate);
        let endDate = new Date(data.endDate);
        endDate.setDate(endDate.getDate() + 1);
        query["invoice.invoiceDate"] = { $gte: initDate, $lt: endDate };
    }

    if (data.total !== 0 && data.total > 0) {
        query["total"] = { $lte: data.total };
    }

    if (data.document) {
        if (data.document === "FACTURA (PDF)") query["$or"] = [{ "documents.invoicePDF" : { $eq: null } }, { "documents.invoicePDF" : { $eq: "" } }];
        if (data.document === "FACTURA (XML)") query["$or"] = [{ "documents.invoiceXML" : { $eq: null } }, { "documents.invoiceXML" : { $eq: "" } }];
        if (data.document === "COMPROBANTE DE PAGO") query["$or"] = [{ "documents.voucherOfPayment" : { $eq: null } }, { "documents.voucherOfPayment" : { $eq: "" } }];
        if (data.document === "COMPLEMENTO1 (PDF)") query["$or"] = [{ "documents.partialPDF" : { $eq: null } }, { "documents.partialPDF" : { $eq: "" } }];
        if (data.document === "COMPLEMENTO1 (XML)") query["$or"] = [{ "documents.partialXML" : { $eq: null } }, { "documents.partialXML" : { $eq: "" } }];
    }

    return query;
}

module.exports.GetQuery = GetQuery;