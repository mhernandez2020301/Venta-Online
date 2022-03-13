var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var carritocomSchema = ({
    confirmacion: Boolean,
    usuario: {type: Schema.ObjectId, ref: "usuarios"},
    productos: [{type: Schema.ObjectId, ref: "productos"}],
    stock: [Number]
})

module.exports = mongoose.model("carritodecompras", carritocomSchema);