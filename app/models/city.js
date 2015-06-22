var mongoose = require('mongoose');


var CitySchema = new mongoose.Schema({
    nomeCidade: String,
    sigla: String,
    headline: String,
    slug: String,
    publicadoPor: String,
    tags: [String],
    caracteristicas: [String],
    conhecidaPor: [String],
    descricao: String,
    amam: String,
    reclamam: String,
    frase1: String,
    bairros: [String],
    razoes: [{
        razao: String,
        iconerazao: String,
        descricaorazao: String
    }],
    outrosbairros: [String],
    fotoDestaque: String,
    imagem1: String,
    imagem2: String,
    imagem3: String,
    status: {type: String, index: true, default: "rascunho"}
});

// create the model for users and expose it to app // Users var
module.exports = mongoose.model('City', CitySchema);