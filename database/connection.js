const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://getsokay:getsokay@getsokay.bxirq0d.mongodb.net/getsokay?retryWrites=true&w=majority").then(() => {
//mongoose.connect("mongodb://localhost:27017/GetsOkay").then(() => {
    console.log("connection success")
}).catch((error) => {
console.log("no connection " + error);
})