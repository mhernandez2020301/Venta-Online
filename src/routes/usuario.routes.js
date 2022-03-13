const express = require('express');
//Controladores Usuario
const controladoresUsuario = require('../controller/usuario.controller');
const md_autenticacion = require('../middleware/autenticacion');

const api = express.Router();

//Post = Crear(Obtener Token)
api.post("/addUsuario", md_autenticacion.Auth, controladoresUsuario.AddUsuario);
api.post('/login', controladoresUsuario.Login);

//Put = Editar
api.put("/upUsuario/:idUser", md_autenticacion.Auth, controladoresUsuario.UpUser);

//Delete = Eliminar
api.delete('/reUsuario/:idUser', md_autenticacion.Auth, controladoresUsuario.ReUser);

module.exports = api;