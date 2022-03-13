const express = require('express');
const controladorCategoria = require('../controller/categoria.controller');

const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

api.post("/addCategoria", md_autenticacion.Auth, controladorCategoria.AddCategoria);
api.put("/upCategoria/:idCat", md_autenticacion.Auth, controladorCategoria.UpCategoria);
api.delete("/reCategoria/:idCat", md_autenticacion.Auth, controladorCategoria.RemoveCategoria);
api.get("/getCategorias", md_autenticacion.Auth, controladorCategoria.GetCategorias);
api.get("/seCategorias", md_autenticacion.Auth, controladorCategoria.SearchCategorias);

module.exports = api;