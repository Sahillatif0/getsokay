const mongoose = require("mongoose");

const WatchedadsSchema = new mongoose.Schema({
    username : String,
    watched_ads : [
        {
            ad_id : Number,
            watchedAt : Date
        }
    ]
})

const Watchedads = new mongoose.model("Watchedads_Data", WatchedadsSchema);

module.exports = Watchedads;