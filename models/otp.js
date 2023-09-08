const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
    username : String,
    email : String,
    otp : Number,
    createdAt : Date,
    expiredAt : Date    
})

const OTP = new mongoose.model("OTP", OTPSchema);

module.exports = OTP;