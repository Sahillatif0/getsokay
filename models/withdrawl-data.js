const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema({
    withdrawID : String,
    email : String,
    username : String,
    Account_Name : String,
    Account_Number : String,
    amount : String,
    method : String,
    date : Date,
    status : String
})

const WithdrawData = new mongoose.model("Withdraw_Data", withdrawSchema);

module.exports = WithdrawData;