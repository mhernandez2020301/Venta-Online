const express = require('express');

//Conexión al controller
const carritoController = require('../controller/carrito.controller');
const api = express.Router();
const md_autenticacion = require('../middleware/autenticacion');

//Añadir productos al carrito 
api.put('/addtoCarrito/:idUser/:idPr', md_autenticacion.Auth, carritoController.AddACarrito);


module.exports = api;