const Facturas = require('../models/facturas.models');
const Usuarios = require('../models/usuarios.models');
const Carrito = require('../models/carrito.models');
const Productos = require('../models/productos.models');

function addFacturas(req, res) {
    var idUsuarios = req.user.sub;
    var modeloFacturas = new Facturas();
    var modeloCarrito = new Carrito();
    var i = 0;
    var c = 0;

    Carrito.findOne({dueño: idUsuarios}, (err, carritoEncontrado) =>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if (!carritoEncontrado) {
            return res.status(403).send({mensaje: 'Error al encontrar carrito'});
        } else {
            if(carritoEncontrado.productos == '') {
                return res.status(403).send({mensaje: 'El carrito no tiene productos'})
            } else {
                var cantidad = carritoEncontrado.cantidad;
                var productos = carritoEncontrado.productos;
                
                productos.forEach(contador =>{
                    Productos.findOne({_id:contador}, (err, productosEncontrados) =>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if (!productosEncontrados) {
                            return res.status(404).send({mensaje: 'Error al encontrar productos'});
                        } else {
                            var cProductos = productosEncontrados;
                            if(cProductos<cantidad[i]){
                                i++
                                return res.status(500).send({mensaje: 'Cantidad mayor a la existente'});
                            } else {
                                i++
                            }
                        }
                    })
                })

                productos.forEach(contador =>{
                    Productos.findOne({_id:contador}, (err, productosEncontrados) =>{
                        if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if (!productosEncontrados) {
                            return res.status(404).send({mensaje: 'Error al encontrar productos'});
                        } else {
                            var cProductos = productosEncontrados.cantidad;
                            var cantidadTotal = cProductos - contador[c];
                            c++;
                            Productos.findByIdAndUpdate(contador, {cantidad: cantidadTotal}, {new:true}, (err, cantidadActualizada) =>{
                                if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                                if (!cantidadActualizada) return res.status(404).send({mensaje: 'Error al actualizar cantidad'});
                                return console.log('Cantidad del producto actualizada de manera correcta');
                            })
                        }

                    })
                })

                modeloFacturas.nombre = req.user.nombre;
                modeloFacturas.productos = productos;
                modeloFacturas.save((err, facturasGuardadas) =>{
                    if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                    if (!facturasGuardadas) {
                        return res.status(404).send({mensaje: 'Error al guardar facturas'});
                    }  else {
                        Usuarios.findByIdAndUpdate(idUsuarios, {push:{facturas: facturasGuardadas._id}}, {new:true}, (err, usuariosActualizados) =>{
                            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                            if (!usuariosActualizados) {
                                return res.status(404).send({mensaje: 'Error al actualizar usuarios'});
                            } else {
                                Carrito.findOneAndRemove({dueño: idUsuarios}, (err, carritoEliminado) =>{
                                    if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                                    if (!carritoEliminado) {
                                        return res.status(404).send({mensaje: 'Error al eliminar carrito'});
                                    } else {
                                        modeloCarrito.dueño = req.user.sub;
                                        modeloCarrito.save((err, carritoGuardado) =>{
                                            if (err) return res.status(500).send({mensaje: 'Error en la peticion'});
                                            if (!carritoGuardado) return res.status(404).send({mensaje: 'Error al guardar carrito'});
                                            return res.status(200).send({facturas: facturasGuardadas});
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }
    })
}

module.exports = {
    addFacturas
}
module.exports = {
    addFacturas
}