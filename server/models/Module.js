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

const frigoSchema = extendSchema(moduleappSchema, {
    temperature: {type: String, required: true, unique: true},
    humidity: {type: String, required: true, unique: true}
});

const Frigo = mongoose.model("Frigo", frigoSchema);

exports.Frigo = Frigo;
