var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProductoSchema = ({
    name: String,
    price: Number,
    stock: Number
})

module.exports = mongoose.model("Producto", ProductoSchema)