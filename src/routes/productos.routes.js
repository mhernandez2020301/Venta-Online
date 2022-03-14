const express = require('express');

//Conexión con el controlelr
const ProductoController = require('../controller/producto.controller');
const md_autenticacion = require('../middleware/autenticacion');


const api = express.Router();

//Crear
api.put("/addProducto/:idCat", md_autenticacion.Auth, ProductoController.AddProductos);

//Update
api.put("/:idCat/upProducto/:idPr", md_autenticacion.Auth, ProductoController.UpProducto);

//Remove
api.put("/:idCat/reProducto/:idPr", md_autenticacion.Auth, ProductoController.ReProducto);

//Gets
api.get("/getProductos", md_autenticacion.Auth, ProductoController.GetProducto);
api.get("/seProductos", md_autenticacion.Auth, ProductoController.SearchProducto);

module.exports = api;