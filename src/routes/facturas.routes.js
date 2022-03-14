const express = require('express');

//Conexión a Controlador
const controllerFacturas = require('../controller/factura.controller');

//Middleware
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

//Crear 
api.post('/AddProductosAFacturas/:idFac/:idPr', md_autenticacion.Auth, controllerFacturas.AddProductosAFacturas);
api.post('/AddFa', md_autenticacion.Auth, controllerFacturas.AddFactura);
module.exports = api;