// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS



// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cabecera
app.use(cors());

// Cargar Rutas
app.use('/api');


module.exports = app;