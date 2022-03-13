const Usuario = require("../models/usuario.model");



function RegistrarAdmin() {
    var usuarioModel = new Usuario();
    usuarioModel.nombrecompleto = 'ADMIN';
    usuarioModel.email = 'ADMIN';
    usuarioModel.rol = 'ADMIN';
    usuarioModel.password = '123456'
    Usuario.find({ email: 'ADMIN' }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length == 0) {
            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;
                usuarioModel.save((err, usuarioGuardado) => {
                    if (err) return console.log('No se realiza la peticion')
                    if (!usuarioGuardado) return console.log('error al registrar')
                    return console.log('usuario' + ' ' + usuarioGuardado);
                });
            });
        } else {
            return console.log('');
        }
    })
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ email: parametros.email }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        } else {

                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.' })
        }
    })
}

module.exports = {
    RegistrarAdmin,
    Login

}