const express = require('express');
const controladorCarrito = require('../controllers/carrito.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.put('/AddCarrito/:idUser/:idPr',[md_autenticacion.Auth,md_roles.verCliente],controladorCarrito.add);

module.exports = api;