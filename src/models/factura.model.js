var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FacturaSchema = ({
    name: String,
    productos: [{type: Schema.ObjectId, ref: "Productos"}]
})

module.exports = mongoose.model("Factura", FacturaSchema);

