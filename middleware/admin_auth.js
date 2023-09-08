const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
require('dotenv').config();
app.use(cookie());

const User = require("../models/registration");
const UserReferralData = require("../models/referrals");
const Deposit_Data = require("../models/deposit-data");
const Withdrawl_Data = require("../models/withdrawl-data");
const Ads_Data = require("../models/ads");

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        if (!token) {
            res.redirect('/login');
        }
        else {
            const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
            if (verifyToken.username!=="Sahillatif"){
                res.render('notfound');
            }
            else {
                const UsersData = await User.find();
                const ReferralsData = await UserReferralData.find();
                const DepositsData = await Deposit_Data.find();
                const WithdrawlsData = await Withdrawl_Data.find();
                
                req.Users = UsersData;
                req.Referrals = ReferralsData;
                req.Deposits = DepositsData;
                req.Withdrawls = WithdrawlsData;
                next();
            }
        }
    } catch (err) {
        res.status(401).send(err);
    }
}
module.exports = auth;