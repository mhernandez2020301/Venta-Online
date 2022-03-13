var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productoSchema = ({
    nombre: String,
    precio: Number,
    stock: Number
})

module.exports = mongoose.model("productos", productoSchema);