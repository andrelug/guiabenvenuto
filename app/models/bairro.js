var mongoose = require('mongoose');


var BairroSchema = new mongoose.Schema({
    nomeBairro: String,
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
    frase2: String,
    frase3: String,
    frase4: String,
    bairros: [String],
    anuncios: [{
        link: String,
        imagem: String,
        tipo: String
    }],
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
    imagem4: String,
    imagem5: String,
    imagem6: String,
    imagem7: String,
    imagem8: String,
    imagem9: String,
    imagem10: String,
    imagem11: String,
    imagem12: String,
    imagem13: String,
    imagem14: String,
    depoimentos: [{
        nome: String,
        imagem: String,
        texto: String
    }],
    status: {type: String, index: true, default: "rascunho"}
});

// create the model for users and expose it to app // Users var
module.exports = mongoose.model('Bairro', BairroSchema);