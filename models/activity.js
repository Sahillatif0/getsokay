const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    ID : String,
    email : String,
    username : String,
    action : String,
    reward : String,
    info : String,
    negative : Boolean,
    date : Date
})

const Data = new mongoose.model("Activity_history", activitySchema);

module.exports = Data;