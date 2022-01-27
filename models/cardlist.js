const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CardSchema = require('./cards');

const CardListSchema = new Schema({
    cards: [CardSchema]
});

const CardListSchema = mongoose.model('CardList', CardListSchema);
module.exports = CardListSchema;