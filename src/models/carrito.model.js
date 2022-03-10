var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CarritoSchema = ({
    compra: Boolean,
    propietario: {type: Schema.ObjectId, ref: "Usuario"},
    productos: [{type: Schema.ObjectId, ref: "Producto"}],
    stock: [Number]
})

module.exports = mongoose.model("Carrito", CarritoSchema);