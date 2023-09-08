const mongoose = require("mongoose");

const depositSchema = new mongoose.Schema({
    depositID : String,
    email : String,
    username : String,
    transaction_id : String,
    amount : String,
    method : String,
    tprice : String,
    date : Date,
    status : String
})

const DepositData = new mongoose.model("Deposit_Data", depositSchema);

module.exports = DepositData;