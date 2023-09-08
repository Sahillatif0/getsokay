const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    userID : Number,
    username : String,
    name : String,
    email : String,
    phone : String,
    countrycode : String,
    password : String,
    avatar : String,
    emailStatus : String,
    phoneStatus : String,
    account : String,
    availableBalance: String,
    depositedBalance : String,
    withdrawnBalance : String,
    referralEarned : String,
    Earned : String,
    referralID : Number,
    referrerID : Number,
    referralCount : Number,
    plan : String,
    planAvailed : Date,
    planExpiry : Date,
    createdAt : Date,
    tokens : [
        {
        token : String
    }
]
})

userSchema.methods.generateAuthToken = async function () {
    try{
        let token = jwt.sign({username: this.username}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    }catch(error){
        console.log("In function", error);
    }
}

const Users = new mongoose.model("User", userSchema);

module.exports = Users;