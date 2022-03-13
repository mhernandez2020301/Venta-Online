var Producto = require("../models/producto.models");
var Categoria = require("../models/categoria.models");

//Add Producto (Crear productos)
function AddProductos(req,res){
    var idCat = req.params.idCat;
    var parametros = req.body;
    var modelProductos = new Producto();

    if(parametros.nombre && parametros.precio && parametros.stock){
        Categoria.findById(idCat,(err, categoriaFind)=>{

            if(err) return res.status(500).send({mensaje:'Error en la petición (Producto):('});
            if(categoriaFind){
                Producto.findOne({nombre: parametros.nombre},(err, productoFind)=>{
                    if(err) return res.status(500).send({mensaje:'Error en la petición (Producto) :('});
                    if(productoFind){
                        return res.status(500).send({mensaje:'El producto está registrado :('})
                    }else{
                        modelProductos.nombre= parametros.nombre;
                        modelProductos.precio = parametros.precio;
                        modelProductos.stock = parametros.stock;
                        modelProductos.save((err,productoSaved)=>{
                        if(err) return res.status(500).send({mensaje:'Error en la creación del Producto :('});
                        if(productoSaved){
                            Categoria.findByIdAndUpdate(idCat, { $push: {productos: productoSaved._id }},{new: true},(err,categoriaUpdated)=>{
                              if(err) return res.status(500).send({mensaje:'Error en la petición :('});
                              if(!productoSaved)return res.status(500).send({mensaje:'Error al agregar en Categoría :('});
                              console.log(categoriaUpdated);
                              return res.status(200).send({producto: categoriaUpdated});
                            })
                        }
                        
                        })
                    }
                })                 
            }
        })
    }else{
        return res.status(500).send({messmensajeage:'llene los campos obligatorios'})
    }
}

//Update de productos (Actualizar productos)
function UpProducto(req,res){
    var idCat = req.params.idCat;
    var idPr = req.params.idPr;
    var parametros = req.body;
    if(parametros.stock){
        Producto.findById(idPr,(err,productosEncontrados)=>{
           if(err) return res.status(500).send({mensaje:'Error en la petición (Producto) :('})
           if(productosEncontrados){
             Categoria.findOne({_id: idCat,idPr: idPr},(err,categoriaEncontrada)=>{
                 if(err) return res.status(500).send({mensaje:'Error en la petición (Categoria) :('});
                 if(categoriaEncontrada){
                     Producto.findByIdAndUpdate(idPr, parametros,{new: true},(err,productoActualizado)=>{
                        if(err) return res.status(500).send({mensaje:''})
                        if(!productoActualizado){
                            return res.status(500).send({mensaje:'Error al actualizar producto :( '});
                        }else{
                            return res.status(200).send({producto:productoActualizado})
                        }
                     })
                 }

             })
           }else{
               return res.status(500).send({mensaje:'El producto no existe :('})
           }       
        })
    }else{
        return res.status(500).send({mensaje:'Ingrese los parametros obligatorios :/'});
    }
}

// Remove Producto (Eliminar Producto)
function ReProducto(req,res){
    var idCat = req.params.idCat;
    var idPr = req.params.idPr;
    Categoria.findOneAndUpdate({_id:idCat,productos: idPr},{$pull:{productos:idPr}},{idPr: true},(err,categoriaActializada)=>{
     if(err) return res.status(500).send({message:'error en la peticion '})
       if(!categoriaActializada){
           Producto.findByIdAndRemove(idPr, (err,productoElinado)=>{
              if(err) return res.status(500).send({message:'erro al eliminar el producto'});
              if(!productoElinado){
                   return res.status(500).send({message:'no se elimino el producto'})
              }else{
                  return res.status(200).send({productos:productoElinado})
              }

           })

       }else{
           return res.status(500).send({message:'el producto no existe'})
       }
    })
}


function GetProducto(req,res){
    Producto.find({}).exec((err, productosEncontrados)=>{
        if(err){
            return res.status(500).send({message: "Error al encontrar los productos"});
        }else if(productosEncontrados){
            return res.send({message: "Productos: ", productosEncontrados});
        }else{
            return res.status(403).send({message: "No se encontraron productos"});
        }
    })
}

function SearchProducto(req,res){
    var parametros = req.body;

    if(parametros.search){
        Producto.find({nombre: parametros.search},(err, resultado)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar coincidencias"});
            }else if(resultado){
                return res.send({producto: resultado});
            }else{
                return res.status(403).send({message: "No se encontraron coincidencias"});
            }
        })
    }else if(parametros.search == ""){
        Producto.find({}).exec((err, productos)=>{
            if(err){
                return res.status(500).send({message: "Error al buscar"});
            }else if(productos){
                return res.send({message: "Productos: ",productos});
            }else{
                return res.status(403).send({message: "No se encontraron productos"});
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese el campo de búsqueda (search)"});
    }
}

function OutProductos(req,res){
    Producto.find({stock: 0},(err, resultado)=>{
        if(err){
            return res.status(500).send({message: "Error al buscar productos agotados"});
        }else if(resultado){
            if(resultado != ""){
                return res.send({message: "Productos agotados: ", resultado});
            }else{
                return res.status(404).send({message: "No se encontraron productos agotados"});
            }
        }else{
            return res.status(404).send({message: "No se encontraron productos agotados"});
        }
    })
}

module.exports = {
    AddProductos,
    UpProducto,
    ReProducto,
    GetProducto,
    SearchProducto,
    OutProductos
}