const express = require('express');
const ProductoController = require('../controller/producto.controller');
const md_autenticacion = require('../middleware/autenticacion');


const api = express.Router();


api.put("/addProducto/:idCat", md_autenticacion.Auth, ProductoController.AddProductos);
api.put("/:idCat/upProducto/:idPr", md_autenticacion.Auth, ProductoController.UpProducto);
api.put("/:idCat/reProducto/:idPr", md_autenticacion.Auth, ProductoController.ReProducto);
api.get("/getProductos", md_autenticacion.Auth, ProductoController.GetProducto);
api.get("/seProductos", md_autenticacion.Auth, ProductoController.SearchProducto);

module.exports = api;