const express = require('express');

//Conexión al controlador
const controladorCategoria = require('../controller/categoria.controller');

//Middleware
const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

//Crear
api.post("/addCategoria", md_autenticacion.Auth, controladorCategoria.AddCategoria);

//Update
api.put("/upCategoria/:idCat", md_autenticacion.Auth, controladorCategoria.UpCategoria);

//Delete
api.delete("/reCategoria/:idCat", md_autenticacion.Auth, controladorCategoria.RemoveCategoria);

//Gets
api.get("/getCategorias", md_autenticacion.Auth, controladorCategoria.GetCategorias);
api.get("/seCategorias", md_autenticacion.Auth, controladorCategoria.SearchCategorias);

module.exports = api;