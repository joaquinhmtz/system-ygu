const errorHandler = (error, request, response, next) => {

    let message = '';
    let errorObj = {};
    let regexReference = /ReferenceError/i;
    let regexValidation = /ValidationError/i;
    let regexEnoent = /ENOENT/i;

    if (regexReference.test(error)) {
        errorObj["message"] = "Referencia desconocida";
        errorObj["status"] = 500;
        errorObj["error"] = error.toString();
    } else if (regexValidation.test(error)) {
        errorObj["message"] = "Los campos no cumple con la validación requerida";
        errorObj["status"] = 500;
        errorObj["error"] = error.toString();
    } else if (regexEnoent.test(error)) {
        errorObj["message"] = "No se ha encontrado el directorio destino";
        errorObj["status"] = 500;
        errorObj["error"] = error.toString();
    }

    console.log("error****", error);
    
    // if (error && error.error === 'ENOENT') {
    //     error['error'] = error.message;
    //     error['message'] = 'No se ha encontrado el directorio destino';
    //     error['status'] = 400;
    // } else {
    //     error['error'] = error.message;
    //     switch (error.name) {
    //         case 'ReferenceError':
    //             message = 'Error de referencia';
    //             error['message'] = 'Error de referencia';
    //         break;
    //     }
    //     error['status'] = 500;
    // }

    response.status(errorObj.status).json({ status: errorObj['status'], error: errorObj.error, message: (message!=''?message:errorObj.message)});
}

module.exports.errorHandler = errorHandler;