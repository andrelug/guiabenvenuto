var mongoose = require('mongoose');


var CitySchema = new mongoose.Schema({
    title: String,
    slug: String,
    headline: String,
    description: String,
    good: String,
    bad: String,
    tags: [String],
    cover: String,
    attributes: [String],
    map: String,
    text: String,
    bairros: [String],
    type: String,
    status: {type: String, index: true, default: "rascunho"}
});

// create the model for users and expose it to app // Users var
module.exports = mongoose.model('City', CitySchema);