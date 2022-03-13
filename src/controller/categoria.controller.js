const Categoria = require('../models/categoria.models');


function CategoriaDefault(){
    var nombre = "Predeterminada"
    const modeloCategoria = new Categoria();
    Categoria.findOne({nombre: nombre},(err, categoriaEncontrada)=>{
        if(categoriaEncontrada < 1){
        if(err){
            console.log("Error al encontrar la categoria por defecto",err);
        }else if(categoriaEncontrada){
            console.log(":)");
        }else{
            modeloCategoria.nombre = "Predeterminada";
            modeloCategoria.save((err, categoriaGuardada)=>{
                if(err){
                    console.log("Error al agregar categoría :(");
                }else if(categoriaGuardada){
                    console.log("Categoría default creada :)");
                }
            })
        }
    } else{
        return console.log(":) Categoria Def")
    }
    })

}

//Añadir Categoria (Sirve para clasificar los productos <<Ejemplo: "Lacteos">>)
function AddCategoria(req,res){
    var parametros = req.body;
    const Categoriamodel = new Categoria();
    if(parametros.nombre){
        console.log(parametros)
        Categoria.findOne({nombre: parametros.nombre},(err, categoriaEncontrada)=>{
            if(err){
                return res.status(500).send({mensaje: "Error"});
            }else if(categoriaEncontrada){
                return res.send({mensaje: "Ya existe la Categoria, intente otra vez :("});
            }else{
                Categoriamodel.nombre = parametros.nombre;
                Categoriamodel.save((err, categoriaGuardada)=>{
                    if(err){
                        return res.status(500).send({mensaje: "Error al Agregar Categoria, intente nuevamente"});
                    }else if(categoriaGuardada){
                        return res.send({categoria: categoriaGuardada});
                    }else{
                        return res.status(404).send({mensaje: "No se puedo almacenar la Categoría"});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({mensaje: "No ingresó los campos de la Categoría"});
    }
}

function UpCategoria(req,res){
    const idCat = req.params.idCat;
    const parametros = req.body;
    if(parametros.nombre){
        Categoria.findOne({nombre: parametros.nombre},(err, catFind)=>{
            if(err){
                return res.status(500).send({message: "Error al encontrar categoria"});
            }else if(catFind){
                
                return res.send({message: "Categoría existente"});
            }else{
                Categoria.findByIdAndUpdate(idCat, parametros, {new:true}, (err, categoriaUp)=>{
                    if(err){
                        return res.status(500).send({message: "Error al actualizar producto :("});
                    }else if(categoriaUp){
                        return res.send({categoria: categoriaUp});
                    }else{
                        return res.status(500).send({message: "No se completó la acción :("});
                    }
                })
            }
        })
    }else{
        return res.status(403).send({message: "Ingrese los datos a modificar (Nombre)"});
    }
}

function RemoveCategoria(req,res){
    const idCat = req.params.idCat;
    Categoria.findOne({_id : idCat}, (err, categoriaEncontrada)=>{
        if(err){
            return res.status(500).send({message: "error en la petion de categoria"});
        }else if(categoriaEncontrada){
            var productos = categoriaEncontrada.productos;
            Categoria.findOneAndUpdate({busqueda: "Default"},{$push:{productos: productos}}, {new: true},(err, categoriaActualizada)=>{
                if(err){
                    return res.status(500).send({message: "error al actualizar a Default"});
                }else if(categoriaActualizada){
                    Categoria.findOne({_id : idCat},(err, categoriaEncontrada)=>{
                        if(err){
                            return res.status(500).send({message: "error en la peticion de la categoria "});
                        }else if(categoriaEncontrada){
                            Categoria.findByIdAndRemove(idCat,(err, categoriaEliminada)=>{
                                if(err){
                                    return res.status(500).send({message: "error al eliinar la categoria"});
                                }else if(categoriaEliminada){
                                    return res.send({categoria: categoriaEliminada});
                                }else{
                                    return res.status(404).send({message: "error al eliinar la categoriar"});
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'error la categoira no existe'});
                        }
                    })
                }else{
                    return res.status(404).send({message: "error al actualizar"});
                }
            })
        }else{
            return res.status(403).send({message: "error la categoria no existe"});
        }
    })
}

function GetCategorias(req,res){
    Categoria.find({}).populate("productos").exec((err, TdoCategorias)=>{
        if(err){
            console.log(TdoCategorias)
            return res.status(500).send({message: "Error al obtener los datos"});
        }else if(TdoCategorias){
            return res.send({message: " Todas las categorias:", TdoCategorias});
        }else{
            return res.status(403).send({message: "No hay datos"});
        }
    })
}

function SearchCategorias(req,res){
    var parametros = req.body;

    if(parametros.search){
        Categoria.find({nombre: parametros.search},(err, categoriaEncontrada)=>{
            if(err){
                return res.status(500).send({message: "error al buscar categoria"});
            }else if(categoriaEncontrada){
                if(categoriaEncontrada != ""){
                    return res.send({message: "Coinciencias encontradas: ", categoriaEncontrada});
                }else{
                    return res.status(404).send({message: "no se encontraron coincidencias"});
                }
            }else{
                return res.status(404).send({message: "No se encontraron coincidencias owo"});
            }
        })
    }else if(parametros.search == ""){
        Categoria.find({}).exec((err, Categorias)=>{
            if(err){
                return res.status(500).send({message: "error al obtener las categorias"});
            }else if(Categorias){
                return res.send({categorias: Categorias});
            }else{
                return res.status(403).send({message: "No hay cateogiras disponibles"});
            }
        })
    }else{
        return res.status(403).send({message: "debe llenar los parametros obligatorios"});
    }
}

module.exports = {
    AddCategoria,
    CategoriaDefault,
    UpCategoria,
    RemoveCategoria,
    GetCategorias,
    SearchCategorias
}