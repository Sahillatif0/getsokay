const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    email : String,
    username : String,
    referralID : Number,
    referralCount : Number,
    referrals : Array,
    plan: String
})

const ReferralData = new mongoose.model("Referrals", referralSchema);

module.exports = ReferralData;