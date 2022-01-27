const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
   name: {
       type: String,
       required: true
   },
   advanced_format: {
       type: String,
       required: true
   },
   previously_at: {
       type: Number,
       required: true
   }
});

const CardSchema = mongoose.model('Cards', CardSchema);
module.exports = CardSchema;