const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    ID : String,
    email : String,
    username : String,
    action : String,
    reward : String,
    referral : String,
    date : Date
})

const Data = new mongoose.model("Referral_history", referralSchema);

module.exports = Data;