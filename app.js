// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS (Se importan las rutas donde se encuentran las funciones)
const UsuariosRutas = require('./src/routes/usuario.routes');
const CategoriasRutas = require('./src/routes/categoria.routes');
const ProductosRutas = require('./src/routes/productos.routes');
const CarritoRutas = require('./src/routes/carrito.routes');

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cabecera
app.use(cors());

// Cargar Rutas
app.use('/api', UsuariosRutas, CategoriasRutas, ProductosRutas, CarritoRutas);


module.exports = app;