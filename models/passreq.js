const mongoose = require("mongoose");

const reqSchema = new mongoose.Schema({
    username : String,
    hash : String,
    createdAt : Date,
    expiredAt : Date    
})

const req = new mongoose.model("Password Req", reqSchema);

module.exports = req;