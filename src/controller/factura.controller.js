const Facturas = require('../models/facturas.models');
const Usuarios = require('../models/usuarios.models');
const Carrito = require('../models/carrito.models');
const Productos = require('../models/productos.models');

function AddFactura(req, res) {
    var parametros = req.body;
    var modelFactura = new Facturas();

    if(parametros.nit) {
        modelFactura.idUsuario = req.user.sub;
        modelFactura.nit = parametros.nit;

        modelFactura.save((err, facturaGuardada) => {
            if(err) return res.status(500).send({ mensaje: "Error en la Petición" });
            if(!facturaGuardada) return res.status(500).send({mensaje: "Error al Agregar Factura" });

            return res.status(200).send({factura: facturaGuardada});
        });
    } else {
        return res.status(500).send({ mensaje: "Debe Ingresar los Datos Necesarios"});
    }
}

function AddProductosAFacturas(req,res){
    var idFac = req.params.idFac;
    var parametros = req.body;
    var modelFacturas = new Facturas();

    if(parametros.nombre){
        Facturas.findById(idFac,(err, categoriaFind)=>{

            if(err) return res.status(500).send({mensaje:'Error en la petición (Producto):('});
            if(categoriaFind){
                Productos.findOne({nombre: parametros.nombre},(err, productoFind)=>{
                    if(err) return res.status(500).send({mensaje:'Error en la petición (Producto) :('});
                    if(productoFind){
                        return res.status(500).send({mensaje:'El producto está registrado :('})
                    }else{
                        modelFacturas.nombre= parametros.nombre;
                        modelFacturas.save((err,facturaSaved)=>{
                        if(err) return res.status(500).send({mensaje:'Error en la creación del Producto :('});
                        if(facturaSaved){
                            Facturas.findByIdAndUpdate(idFac, { $push: {factura: facturaSaved._id }},{new: true},(err,facUpdated)=>{
                              if(err) return res.status(500).send({mensaje:'Error en la petición :('});
                              if(!facturaSaved)return res.status(500).send({mensaje:'Error al agregar en Categoría :('});
                              console.log(facUpdated);
                              return res.status(200).send({producto: facUpdated});
                            })
                        }
                        
                        })
                    }
                })                 
            }
        })
    }else{
        return res.status(500).send({mensaje:'Ingrese los datos correctamente :('})
    }
}


module.exports = {
    AddFactura,
    AddProductosAFacturas
}