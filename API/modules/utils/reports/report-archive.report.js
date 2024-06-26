let xl = require('excel4node');
let path = require("path");
let rootPath = path.normalize(__dirname + '/../../..');
let moment = require('moment');

const GenerateReportArchive = async (data)  => {
    try {
        let today = Date.now();
        let wb = new xl.Workbook();
        let options = {
            'pageSetup' : {
                'fitToHeight': 10,
                'fitToWidth': 1,
                'orientation': 'landscape'
            },
            'printOptions': {
                'centerHorizontal': true,
                'printGridLines': false,
            },
            'sheetView' : {
                'showGridLines' : true
            }
        };
        let Title = wb.createStyle({
            font: {
                size: 15,
                bold: false,
                name: 'Montserrat',
                color: '#000000'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                shrinkToFit: true,
                wrapText: true,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#DBDBDB',
            }
        });
        let SubTitle = wb.createStyle({
            font: {
                size: 9,
                bold: false,
                name: 'Montserrat',
                color: '#000000'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                shrinkToFit: true,
                wrapText: true,
            },
            fill: {
                type: 'pattern',
                patternType: 'solid',
                bgColor: '#000000',
                fgColor: '#DBDBDB',
            }
        });
        let valueStyle = wb.createStyle({
            font: {
                size: 9,
                bold: false,
                name: 'Montserrat',
                color: '#000000'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                shrinkToFit: true,
                wrapText: true,
            },
            border: {
                left: {
                    style: 'thin',
                    color: '#000000'
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
            },
        });
        let linkStyle = wb.createStyle({
            font: {
                size: 9,
                bold: false,
                name: 'Montserrat',
                color: '#0084C7'
            },
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                shrinkToFit: true,
                wrapText: true,
            },
            border: {
                left: {
                    style: 'thin',
                    color: '#000000'
                },
                right: {
                    style: 'thin',
                    color: '#000000'
                },
                top: {
                    style: 'thin',
                    color: '#000000'
                },
                bottom: {
                    style: 'thin',
                    color: '#000000'
                },
            },
        });
        let ws = wb.addWorksheet('REPORTE DEL ARCHIVERO', options);

        //Config columns
        ws.column(1).setWidth(50); 	//Empresa
        ws.column(2).setWidth(50); 	//Cliente
        ws.column(3).setWidth(25); 	//Movimiento
        ws.column(4).setWidth(25); 	//Fecha
        ws.column(5).setWidth(25); 	//Monto
        ws.column(6).setWidth(25); 	//Facturación
        ws.column(7).setWidth(25); 	//Tipo cliente
        ws.column(8).setWidth(60); 	//Factura(pdf)
        ws.column(9).setWidth(60); 	//Factura(xml)
        ws.column(10).setWidth(60);  //Comprobante de pago
        ws.column(11).setWidth(60);  //Complemento1(pdf)
        ws.column(12).setWidth(60);  //Comeplemento1(xml)
        //Config Rows
		ws.row(5).setHeight(20);

        ws.cell(1, 1, 1, 12, true).string('').style(Title);
        ws.cell(2, 1, 2, 12, true).string("REPORTE ARCHIVERO").style(Title);
        ws.cell(3, 1, 3, 12, true).string(moment(new Date()).format('DD/MM/YYYY')).style(Title);
        ws.cell(4, 1, 4, 12, true).string('').style(Title);

        //Nombres de la columnas
        ws.cell(5, 1).string("Empresa").style(SubTitle);
        ws.cell(5, 2).string("Cliente").style(SubTitle);
        ws.cell(5, 3).string("Movimiento").style(SubTitle);
        ws.cell(5, 4).string("Fecha").style(SubTitle);
        ws.cell(5, 5).string("Monto").style(SubTitle);
        ws.cell(5, 6).string("Facturación").style(SubTitle);
        ws.cell(5, 7).string("Tipo cliente").style(SubTitle);
        ws.cell(5, 8).string("Factura (PDF)").style(SubTitle);
        ws.cell(5, 9).string("Factura (XML)").style(SubTitle);
        ws.cell(5, 10).string("Comprobante de pago").style(SubTitle);
        ws.cell(5, 11).string("Complemento1 (PDF)").style(SubTitle);
        ws.cell(5, 12).string("Complemento1 (XML)").style(SubTitle);

        let init = 6;
        data.forEach(function(elem) {
            let column = 1;

            ws.cell(init, column++).string(`${elem.enterprise.name} (${elem.enterprise.rfc})`).style(valueStyle);
            ws.cell(init, column++).string(`${elem.client.name} (${elem.client.rfc})`).style(valueStyle);
            ws.cell(init, column++).string(elem.folio).style(valueStyle);
            ws.cell(init, column++).string(moment(elem.invoice.invoiceDate).format('DD/MM/YYYY')).style(valueStyle);
            ws.cell(init, column++).string(`$${parseInt(elem.total)}`).style(valueStyle);
            ws.cell(init, column++).string(elem.invoice.typeInvoice).style(valueStyle);
            ws.cell(init, column++).string(elem.client.type).style(valueStyle);
            ws.cell(init, column++).link(
                (elem.documents.invoicePDF !== 0 ? `${process.env.SERVER}${elem.documents.invoicePDF}` : "-")
            ).style(linkStyle);
            ws.cell(init, column++).link(
                (elem.documents.invoiceXML !== 0 ? `${process.env.SERVER}${elem.documents.invoiceXML}` : "-")
            ).style(linkStyle);
            ws.cell(init, column++).link(
                (elem.documents.voucherOfPayment !== 0 ? `${process.env.SERVER}${elem.documents.voucherOfPayment}` : "-")
            ).style(linkStyle);
            
            let partialPDF = "";
            if (elem.paymentMethod === "PPD") {
                partialPDF = (elem.documents.partialPDF !== 0 ? `${process.env.SERVER}${elem.documents.partialPDF}` : "-")
            } else if (elem.paymentMethod === "PUE") {
                partialPDF = "N/A";
            }
            ws.cell(init, column++).link(partialPDF).style(linkStyle);

            let partialXML = "";
            if (elem.paymentMethod === "PPD") {
                partialXML = (elem.documents.partialXML !== 0 ? `${process.env.SERVER}${elem.documents.partialXML}` : "-")
            } else if (elem.paymentMethod === "PUE") {
                partialXML = "N/A";
            }
            ws.cell(init, column++).link(partialXML).style(linkStyle);

            init++;
        });

        let path = 'static/reports/REPORTE_ARCHIVERO_' + today  + '.xlsx';
        filePath = rootPath + '/public/static/reports/REPORTE_ARCHIVERO_' + today  + '.xlsx';

        wb.write(filePath, function(err, response) {
            if (err) throw new Error(err);
        });

        return path;

    } catch (e) {
        console.log("Err GenerateReportArchive: ", e);
        throw new Error(e);
    }
	// return new Promise ((resolve, reject) => {
	// 	try {
			

	// 	    let Title = wb.createStyle({
	// 			alignment: {
	// 				horizontal: 'center'
	// 			},
	// 			font: {
	// 				bold: true,
	// 				size: 22,
	// 	            name: 'Helvetica',
	// 	            color: '#ffffff'
	// 	        },
	// 	        fill: {
	// 	            type: 'pattern',
	// 	            patternType: 'solid',
	// 	            fgColor: '#ff196a'
	// 	        }
	// 	    });
	// 	    let Title2 = wb.createStyle({
	// 			alignment: {
	// 				horizontal: 'center'
	// 			},
	// 			font: {
	// 				size: 16,
	// 	            name: 'Helvetica',
	// 	            color: '#ffffff'
	// 	        },
	// 	        fill: {
	// 	            type: 'pattern',
	// 	            patternType: 'solid',
	// 	            fgColor: '#ff196a'
	// 	        }
	// 	    });
	// 		let SubTitle = wb.createStyle({
	// 			alignment: {
	// 				horizontal: 'center'
	// 			},
	// 			font: {
	// 				size: 12,
	// 	            name: 'Calibri',
	// 	            color: '#ffffff'
	// 	        },
	// 	        fill: {
	// 	            type: 'pattern',
	// 	            patternType: 'solid',
	// 	            fgColor: '#ff196a'
	// 	        }
	// 	    });
	// 	    let Text = wb.createStyle({
	// 	        alignment: {
	// 				horizontal: 'center',
	// 				vertical: 'center'
	// 			},
	// 	        font: {
	// 				size: 10,
	// 	            name: 'Calibri'
	// 	        },
	// 	    });

	// 	    //Config columns
	// 	    ws.column(1).setWidth(75); 	//Clave y descripción
	// 	    ws.column(2).setWidth(25); 	//Tipo de insumo
	// 	    ws.column(3).setWidth(25); 	//Stock
	// 	    ws.column(4).setWidth(25); 	//Mínimos/Máximos
	// 	    ws.column(5).setWidth(40); 	//Lotes

	// 	    //Config Rows
	// 	    ws.row(5).setHeight(20);

	// 	    ws.cell(1, 1, 1, 5, true).string('').style(Title);
	// 	    ws.cell(2, 1, 2, 5, true).string("Reporte de existencias").style(Title);
	// 	    ws.cell(3, 1, 3, 5, true).string(moment(new Date()).format('DD/MM/YYYY')).style(Title2);
	// 	    ws.cell(4, 1, 4, 5, true).string('').style(Title);

	// 	    //Nombres de la columnas
	// 	    ws.cell(5, 1).string("Clave - Descripción").style(SubTitle);
	// 	    ws.cell(5, 2).string("Tipo de insumo").style(SubTitle);
	// 	    ws.cell(5, 3).string("Stock").style(SubTitle);
	// 	    ws.cell(5, 4).string("Mínimos / Máximos").style(SubTitle);
	// 	    ws.cell(5, 5).string("Lotes").style(SubTitle);

	// 	    let init = 6;
	// 	    let lastInit = 6;
	// 	    let lastLengthLots = 0;

	// 	    data.forEach(function(elem) {
	// 	    	lastLengthLots = 0;
	// 	    	if (elem.lots.length < 1) elem.lots.push({code:'0',stock:'0', expiredDate: 'N/A'});
	// 	    	//ws.cell(startRow, startColumn, [[endRow, endColumn], isMerged]);
	// 	    	if (init === 6) {
	// 	    		ws.cell(init, 1, elem.lots.length + (init-1), 1, true);
	// 	    		ws.cell(init, 1).string(elem.key + ' - ' + elem.description).style(Text);
	// 	    		ws.cell(init, 2, elem.lots.length + (init-1), 2, true);
	// 	    		ws.cell(init, 2).string(elem.typeSupplies ? elem.typeSupplies.name : '').style(Text);
	// 	    		ws.cell(init, 3, elem.lots.length + (init-1), 3, true);
	// 	    		ws.cell(init, 3).number(elem.totalStock).style(Text);
	// 	    		ws.cell(init, 4, elem.lots.length + (init-1), 4, true);
	// 	    		ws.cell(init, 4).string(elem.minimum + ' / ' + elem.maximum).style(Text);
	// 	    	} else {
	// 	    		ws.cell(lastLength, 1, ((lastLength - 1) + elem.lots.length), 1, true);
	// 	    		ws.cell(lastLength, 1).string(elem.key + ' - ' + elem.description).style(Text);
	// 	    		ws.cell(lastLength, 2, ((lastLength - 1) + elem.lots.length), 2, true);
	// 	    		ws.cell(lastLength, 2).string(elem.typeSupplies ? elem.typeSupplies.name : '').style(Text);
	// 	    		ws.cell(lastLength, 3, ((lastLength - 1) + elem.lots.length), 3, true);
	// 	    		ws.cell(lastLength, 3).number(elem.totalStock).style(Text);
	// 	    		ws.cell(lastLength, 4, ((lastLength - 1) + elem.lots.length), 4, true);
	// 	    		ws.cell(lastLength, 4).string(elem.minimum + ' / ' + elem.maximum).style(Text);
	// 	    	}

	// 	    	if (elem.lots.length >= 1) {
	// 	    		for (let i = 0; i < elem.lots.length; i++) {
	// 	    			if (init === 6) {
	// 	    				if (i == 0) ws.cell(init, 5).string('Lt. ' + elem.lots[i].code + ' - ' + elem.lots[i].stock + ' pzas.' + ' - ' + (elem.lots[i].expiredDate != 'N/A' ? moment(elem.lots[i].expiredDate).format('DD/MM/YYYY') : 'N/A')).style(Text);
	// 	    				if (i != 0) ws.cell(lastInit, 5).string('Lt. ' + elem.lots[i].code + ' - ' + elem.lots[i].stock + ' pzas.' + ' - ' + (elem.lots[i].expiredDate != 'N/A' ? moment(elem.lots[i].expiredDate).format('DD/MM/YYYY') : 'N/A')).style(Text);
	// 	    			} else {
	// 	    				ws.cell(lastInit, 5).string('Lt. ' + elem.lots[i].code + ' - ' + elem.lots[i].stock + ' pzas.' + ' - ' + (elem.lots[i].expiredDate != 'N/A' ? moment(elem.lots[i].expiredDate).format('DD/MM/YYYY') : 'N/A')).style(Text);
	// 	    			}
	// 	    			lastInit++;
	// 	    			lastLengthLots++;
	// 	    			//console.log('lastInit for***', lastInit);
	// 	    		}
	// 	    	}

	// 	    	init++;
	// 	    	lastLength = lastInit;
	// 	    	// console.log('lastInit: ', lastInit);
	// 	    	// console.log('lastLength: ', lastLength);
	// 	    });

	// 	    filePath = rootPath + '/public/static/reports/REPORTE_EXISTENCIAS_' + today  + '.xlsx';

	// 	    wb.write(filePath, function(err, response) {

	// 	        if (err) reject(err);
	// 	        else {
	// 	        	resolve({filePath: 'static/reports/REPORTE_EXISTENCIAS_' + today  + '.xlsx'});
	// 	        }
	// 	  	});

	// 	} catch (e) {
	// 		reject(e);
	// 	}
	// });
}

module.exports.GenerateReportArchive = GenerateReportArchive;