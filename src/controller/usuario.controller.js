const Usuario = require("../models/usuario.models");
const Carrito = require("../models/carrito.models");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../service/jwt");


//Administrador automático (Usuario que se crea al iniciar el API)
function RegistrarAdmin(){
    var userModel = new Usuario();
        Usuario.find({ nick : 'ADMIN'}, (err, nickEncontrado) => {
        if(nickEncontrado.length == 0){
            userModel.nombres = 'ADMIN';
            userModel.apellidos = 'ADMIN';
            userModel.nick = 'ADMIN';
            userModel.pass = '123456';
            userModel.rol = 'ADMIN';
            userModel.email = 'ADMIN';
            bcrypt.hash('123456', null, null, (err, passEncriptada) => {
                userModel.pass = passEncriptada;
                userModel.save((err, usuarioSaved) => {
                    if(err) return res.status(500).send({mensaje: ':('});
                    if(!usuarioSaved) return console.log({mensaje: ':('});
                    return console.log(usuarioSaved);
                });
            });
        }else{
            return console.log('Admin :)');
        }
        });
}


//Añadir usuario (Usuarios que pueden comprar)
function AddUsuario(req,res){
    var parametros = req.body;
    var userModel = new Usuario();
    if (req.user.rol == 'ADMIN') {
        if (parametros.nombre && parametros.apellidos && parametros.nick 
            && parametros.email && parametros.pass && parametros.email) {
            userModel.nombre = parametros.nombre;
            userModel.apellidos = parametros.apellidos;
            userModel.nick = parametros.nick;
            userModel.pass = parametros.pass;
            userModel.email = parametros.email;
            userModel.rol = 'CLIENTE';
            Usuario.find({ nick: parametros.nick }, (err, userEncontrado) => {
                if (userEncontrado.length < 1) {
                    bcrypt.hash(parametros.pass, null, null, (err, passEncriptada) => {
                        userModel.pass = passEncriptada;
                        userModel.save((err, usuarioSaved) => {
                            if(err) return res.status(500).send({mensaje: ':('});
                            if(!usuarioSaved) {
                                return console.log({mensaje: ':('});
                            }else{
                                AddCarrito(usuarioSaved);
                                return res.status(200).send({usuario: usuarioSaved});
                            }
                        });
                    });
                } else {
                    
                    return res.status(500).send({ mensaje: 'Este correo está en uso, intente nuevamente :/' });
                }
            })
        }
    }
}


//Funciona para crear el token (Y luego utilizarlo en las otras funciones)
function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ nick: parametros.nick }, (err, userEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion :(' });
        if (userEncontrado) {
            bcrypt.compare(parametros.pass, userEncontrado.pass, (err, verificacionPassword) => {
                    if (verificacionPassword) {   
                        if (parametros.obtenerToken === 'true') {  
                            userEncontrado.pass = undefined;   
                            return res.status(200).send({ usuarios: userEncontrado });
                        } else {
                            return res.status(200).send({ token: jwt.crearToken(userEncontrado) });   
                        }
                    } else {
                        return res.status(500).send({ mensaje: 'La pass no coincide intente nuevamente :(' });
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'Error, el usuario no se encuentra registrado :(' })
        }
    })
}


// Actualizar datos del usuario 
function UpUser(req, res) {
    var idUser = req.params.idUser;
    var parametros = req.body;

    if (idUser !== req.user.sub) 
    return res.status(500).send({ mensaje: 'No puede editar otros usuarios :/' }),
    console.log(idUser+'   '+req.user.sub);

    Usuario.findByIdAndUpdate(req.user.sub, parametros, { new: true },
        (err, usuarioActualizado) => {
            if (err) return res.status(500)
                .send({ mensaje: 'Error en la peticion :(' });
            if (!usuarioActualizado) return res.status(500)
                .send({ mensaje: 'Error al editar el Usuario :(' });
            return res.status(200).send({ usuario: usuarioActualizado })
        })
}


// Remover usuario 
function ReUser(req, res) {
    var idUser = req.params.idUser;
    if(req.user.rol == 'ADMIN'){
        Usuario.findByIdAndDelete(idUser, (err, userEliminado) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la petición :('});
            if (!userEliminado) return res.status(500).send({ mensaje: 'Error al Eliminar el Usuario :(' });
            console.log(userEliminado);
            if(userEliminado){
                RemoveCarrito(userEliminado);
                return res.status(200).send({ usuario: userEliminado});
            }else{
                return res.status(500).send({ mensaje: 'Error, intente nuevamente :('})
            }
            
        })
    } else {
        return res.status(500).send({mensaje: 'Acción denegada, no es el ADMIN :/'})
    }
}

//CARRITO se añaden dentro de las funciones de usuarios para asignarles un carrito o eliminar el mismo
//Creación del Carrito es un método dentro de Add para añadir el carrito con el usuario
function AddCarrito(usuariosSaved) {
    var carrito = new Carrito();
    carrito.confirmacion = false;
    carrito.usuario = usuariosSaved._id;
    carrito.save((err, carritoSaved) => {
        if (err) return console.log(err);
        if (!carritoSaved) return console.log('Error al crear Carrito :(');
        return console.log('Carrito creado :)', carritoSaved);
    })
}

//Remove Carrito, es un método dentro de Remove Usuario para eliminar el carrito junto con el usuario
function RemoveCarrito(usuariosSaved) {
    Carrito.findByIdAndDelete({ usuario: usuariosSaved._id }, (err, carritoRemove) => {
        if (err) {
            console.log('Error al eliminar el carrito :(');
        } else if (carritoRemove) {
            console.log('Carrito eliminado exitosamente :)');
        } else {
            console.log('Intente ingresar correctamente los parametros :/');
        }
    })
}


module.exports = {
    RegistrarAdmin,
    Login,
    AddUsuario,
    UpUser,
    ReUser
}