const jwt = require('jwt-simple');
const moment = require('moment');
const Secret = 'Ventas2022';

exports.Auth = function(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(500).send({mensaje: "la peticion no tiene cabezera de autorizacion"});
    }

    var token = req.headers.authorization.replace(/['  "]+/g, '');

    try {
        var payload = jwt.decode(token, Secret);
        if(payload.exp <= moment.unix){
            return res.status(200).send({mensaje: "el token a expirado"})
        }
    }catch(error) {
        return res.status(500).send({mensaje: "el token no es valido"})
    }

    req.user = payload;
    next();
}