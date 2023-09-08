const mongoose = require("mongoose");

const AdsSchema = new mongoose.Schema({
    username : String,
    ad_Name : String,
    description : String,
    ad_id : Number,
    cpc : Number,
    totalcharges : Number,
    clickasked : Number,
    clickdone : Number,
    url : String,
    duration : String,
    createdAt : Date,
    status : String
})

const AdsSchemas = new mongoose.model("Ads_Data", AdsSchema);

module.exports = AdsSchemas;