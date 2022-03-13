const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var usuarioSchema = Schema ({
    nombre: String,
    apellidos: String,
    nick: String,
    pass: String,
    rol: String,
    email: String,
    factura: [{type: Schema.ObjectId, ref: "facturas"}]
})

module.exports = mongoose.model("usuarios", usuarioSchema);