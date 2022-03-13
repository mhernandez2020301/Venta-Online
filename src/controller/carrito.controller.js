const Carrito = require('../models/carrito.models');
const Productos = require('../models/producto.models');

//Funcion que añade al carrito
function AddACarrito (req, res){
    var idPr = req.params.idPr;
    var idUser = req.user.sub;
    var parametros = req.body;

    if(parametros.stock){
        Productos.findById(idPr,(err, productosEncontrados) =>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion :('});
            if (!productosEncontrados) {
                return res.status(404).send({mensaje: 'Error al encontrar productos :('});
            } else {
                if(parametros.stock > productosEncontrados.stock){
                    return res.status(404).send({mensaje: 'No tenemos suficientes para tu pedido :('});
                } else {
                    Carrito.findOneAndUpdate({usuario: idUser}, {$push:{productos: productosEncontrados._id, stock: parametros.stock}}, {new:true}, (err, carritoActualizado) => {
                        if (err) return res.status(500).send({mensaje: 'Error al realizar la petición :('});
                        if (!carritoActualizado) return res.status(404).send({mensaje: 'Error al actualizar tu Carrito :('});
                        console.log(carritoActualizado);
                        return res.status(200).send({carrito: carritoActualizado});
                    });
                } 
            } 
        })
    } else {
        return res.status(500).send({mensaje: 'Ingrese algún dato válido :/'});
    }
}

module.exports = {
    AddACarrito
} 