let xml2js = require('xml2js');
let fs = require('fs');

const ReadFile = async (data) => {
    try {
        let read = fs.readFileSync(data, 'utf8');
        let parser = new xml2js.Parser();
        let invoice = {};

        parser.parseString(read, (err, result) => {
            if (err) throw new Error(e);
            else {
                result = result["cfdi:Comprobante"];
                invoice = {
                    enterprise: {
                        name: result['cfdi:Emisor'][0]["$"].Nombre,
                        rfc: result['cfdi:Emisor'][0]["$"].Rfc
                    },
                    client: {
                        name: result['cfdi:Receptor'][0]["$"].Nombre,
                        rfc: result['cfdi:Receptor'][0]["$"].Rfc,
                        cfdi: result['cfdi:Receptor'][0]["$"].UsoCFDI,
                    },
                    total: result["$"].Total,
                    invoiceFolio: result["$"].Folio,
                    invoiceDate: result["$"].Fecha,
                    paymentMethod: result["$"].MetodoPago,
                    methodOfPayment: result["$"].FormaPago,
                };
            }
        });

        return invoice;

    } catch (e) {
        console.log("Err ReadFile: ", e);
        throw new Error(e);
    }
}

const DeleteFile = async (data) => {
    try {
        let fullPath = data;

        fs.unlinkSync(fullPath);

        return true;
        
    } catch (e) {
        console.log("Err DeleteFile: ", e);
        throw new Error(e);
    }
}

module.exports.ReadFile = ReadFile;
module.exports.DeleteFile = DeleteFile;