const jwt_simple = require('jwt-simple');
const moment = require('moment');
const Secret = 'Ventas2022';

exports.crearToken = function (usuario) {
    let payload = {
        sub: usuario._id,
        nombre: usuario.nombre,
        nick: usuario.nick,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().month(7, 'month').unix()
    }

    return jwt_simple.encode(payload, Secret);
}