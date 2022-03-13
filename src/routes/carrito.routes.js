const express = require('express');
const carritoController = require('../controller/carrito.controller');
const api = express.Router();
const md_autenticacion = require('../middleware/autenticacion');

api.put('/agregarCarrito/:idUser/:idPr', md_autenticacion.Auth, carritoController.AddACarrito);


module.exports = api;