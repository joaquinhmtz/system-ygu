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

    console.log(query)

    return query;
}

module.exports.GetQuery = GetQuery;