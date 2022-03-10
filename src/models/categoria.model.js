var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategoriaSchema = ({
    name: String,
    productos: [{type: Schema.ObjectsId, ref: "Productos"}]
})

module.exports = mongoose.model("Categoria", CategoriaSchema);