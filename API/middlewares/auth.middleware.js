let jwt = require("jsonwebtoken");
let moment = require("moment");

const tokenValid = (request, response, next) => {
    
    if(!request.headers.authorization){
        return response.status(401).send({ message: 'Usuario no autorizado.', status: 401 });
    }

    let token = request.headers.authorization.replace(/['"]+/g, '').replace('Bearer ', '');
    let payload = {};

    try {
        payload = jwt.verify(token, process.env.SECRET);

        if(payload.exp <= moment().unix()){
            return response.status(500).send({ message: 'El token ha expirado.', status: 401 });
        }
    } catch(ex) {
        return response.status(401).send({ message: 'Token no válido.', status: 401 })
    }

    request.user = payload;
    
    next();
}

module.exports.tokenValid = tokenValid;