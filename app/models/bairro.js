var mongoose = require('mongoose');


var BairroSchema = new mongoose.Schema({
    title: String,
    slug: String,
    headline: String,
    description: String,
    tags: [String],
    cover: String,
    good: String,
    bad: String,
    attributes: [String],
    map: String,
    text: String,
    city: String,
    type: String,
    status: {type: String, index: true, default: "rascunho"}
});

// create the model for users and expose it to app // Users var
module.exports = mongoose.model('Bairro', BairroSchema);