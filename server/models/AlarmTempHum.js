const mongoose = require("mongoose");

//Schema for Alarm
const AlarmTempHumSchema = new mongoose.Schema({
    TempMin: {type: Number, required: true},
    TempMax: {type: Number, required: true},
    HumidityMax: {type: Number, required: true},
    createdAt:{type:String, default:Date.now}
});

var AlarmTempHum = mongoose.model("AlarmTempHum", AlarmTempHumSchema);

module.exports = AlarmTempHum;
