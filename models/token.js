const Schema = mongoose.Schema;

const TokenSchema = new Schema({
   userId: {
       type: Schema.Types.ObjectId,
       ref: "email",
       required: true
   },
   token: {
       type: String,
       required: true
   }
});

const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;