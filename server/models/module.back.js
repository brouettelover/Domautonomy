const mongoose = require("mongoose");
const extendSchema = require('mongoose-extend-schema');

//Schema for modules
const moduleappSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    state: {type: String, required: true, default:"black"},
    topic: {type: String, required: true},
    type: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: false},
    createdAt:{type:String, default:Date.now}
});

const cardSchema = extendSchema(moduleappSchema, {
    carteNum: {type: String, required: false}
});

const periodSchema = mongoose.Schema({
    start: {type:Number, required: true},
    end: {type:Number, required:true}
})

const infraSchema = extendSchema(moduleappSchema, {
    periods: [periodSchema]
});

const solarpanelSchema = extendSchema(moduleappSchema, {
    tension: {type: String, required: false},
});

const Solarpanel= mongoose.model("Solarpanel", solarpanelSchema);
const Infra = mongoose.model("Infra", infraSchema);
const Card = mongoose.model("Card", cardSchema);

exports.Solarpanel = Solarpanel;
exports.Infra = Infra;
exports.Card = Card;