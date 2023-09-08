const mongoose = require("mongoose");

const MsgSchema = new mongoose.Schema({
    userID : Number,
    title : String,
    message : String,
    messagedAt : Date,
    status : String
})

const message = new mongoose.model("Messages", MsgSchema);

module.exports = message;