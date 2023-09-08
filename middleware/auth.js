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
            const currentUser = await User.findOne({
                username: verifyToken.username,
                "token.token": token
            })

            if (!currentUser) {
                res.redirect('/login');
            }
            else {
                const currentUserRef = await UserReferralData.findOne({
                    email: currentUser.email
                });
                const currentUserDeposits = await Deposit_Data.find({
                    email: currentUser.email
                });
                const currentUserWithdrawls = await Withdrawl_Data.find({
                    email: currentUser.email
                });
                let referrals = await User.find({
                    referrerID: currentUser.referralID
                });
                let plan = currentUser.plan;
                let minimum = 60;
                if (plan === "STANDARD") {
                    minimum = 40;
                }
                else if (plan === "PREMIUM") {
                    minimum = 20;
                }
                currentUser.minimum = minimum;
                req.currentUserDeposits = currentUserDeposits;
                req.currentUserWithdrawls = currentUserWithdrawls;
                req.referrals = referrals;
                req.token = token;
                req.currentUser = currentUser;
                req.currentUserRef = currentUserRef;
                next();
            }
        }
    } catch (err) {
        res.status(401).send(err);
    }
}
module.exports = auth;