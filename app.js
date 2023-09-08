const express = require('express');
const app = express();
const path = require('path');
const httpServer = require("http").createServer(app);
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const io = require("socket.io")(httpServer);
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cookie = require("cookie-parser");
require('dotenv').config();
app.use(cookie());

const cors = require('cors');
app.use(cors({
    origin: ['188.40.3.73', '2a01:4f8:d0a:30ff::2', '157.90.97.92']

}));

require("./database/connection");
const User = require("./models/registration");
const OTPVerification = require("./models/otp");
const UserReferralData = require("./models/referrals");
const Deposit_Data = require("./models/deposit-data");
const Withdrawl_Data = require("./models/withdrawl-data");
const Referral_history = require("./models/referral-history");
const Activity_history = require("./models/activity");
const Ads_Data = require("./models/ads");
const WatchedAds_Data = require("./models/user_watched_ads");
const Messages_Data = require("./models/messages");
const NewPass_Req = require("./models/passreq");
const auth = require("./middleware/auth");
const admin_auth = require("./middleware/admin_auth");
const { findSourceMap } = require('module');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {
    res.status(200).render('home.pug');
});
app.get("/login", (req, res) => {
    let savedcookie = req.cookies.jwtoken;
    if (!savedcookie) {
        res.status(200).render('login');
    }
    else {
        res.redirect("/dashboard");
    }

});
app.get("/register", (req, res) => {
    let savedcookie = req.cookies.jwtoken;
    if (!savedcookie) {
        if (!req.query) {
            res.status(200).render('register.pug')
        }
        else {

            res.status(200).render('register.pug', {
                referrerID: req.query.referrerID
            })
        }
    }
    else {
        res.redirect("/dashboard");
    }
});
app.get("/contactus", (req, res) => {
    res.status(200).render('register.pug');
});
app.get("/verify-otp", (req, res) => {
    res.status(200).render('otpverify.pug');
});
app.get("/referrals", auth, (req, res) => {
    res.status(200).render('referrals', {
        currentUser: req.currentUser,
        currentUserRef: req.currentUserRef,
        referrals: req.referrals
    });
});
app.get("/withdrawl", auth, (req, res) => {
    res.status(200).render('withdraw', {
        currentUser: req.currentUser,
        currentUserDeposits: req.currentUserDeposits,
        currentUserWithdrawls: req.currentUserWithdrawls
    });
});
app.get("/upgrade", auth, (req, res) => {
    res.status(200).render('upgrade', {
        currentUser: req.currentUser
    });
});
app.get("/getavailbal", auth, (req, res) => {
    let User = req.currentUser;
    res.send({
        User
    });
});
app.get("/yourads", auth, async (req, res) => {
    const yourads = await Ads_Data.find({
        username: req.currentUser.username
    });
    console.log(yourads);
    res.status(200).render('yourads', {
        currentUser: req.currentUser,
        yourads
    });
});
app.get("/createads", auth, async (req, res) => {
    const ads = await Ads_Data.find();
    console.log(ads);
    res.status(200).render('createads', {
        currentUser: req.currentUser,
        ads
    });
});
app.get("/viewads", auth, async (req, res) => {
    const ads = await Ads_Data.find();
    // res.cookie("kdm", req.currentUser.username)
    var userwatchedads;
    const watchedads = await WatchedAds_Data.findOne({
        username: req.currentUser.username
    })
    if (!watchedads) {
        userwatchedads = new WatchedAds_Data({
            username: req.currentUser.username,
            watched_ads: [
                {
                    ad_id: null,
                    watchedAt: Date.now()
                }
            ]
        });
        await userwatchedads.save();
    }

    res.status(200).render('viewads', {
        currentUser: req.currentUser,
        ads
    });
});
var adsrunning = 0;
var currentad;
var currentad_id;
var addone = false;
var users = [];
io.on("connection", async (socket) => {
    socket.on("socket-type", async (type, username) => {
        socket.type = type;
        socket.username = username;
        console.log(type, username)
        if (socket.type === "ad") {
            adsrunning += 1;
            let currentuser = users.find(o => o.username === username);
            var index = users.indexOf(currentuser);
            let sktid = {
                socket_id: socket.id
            }
            currentuser.adsid.push(sktid);
            currentuser.adsrunning += 1;
            // currentuser = currentuser.adsrunning+=1;
            if (index !== -1) {
                users[index] = currentuser;
            }
            console.log(currentuser);
        }
        else if (socket.type === "main") {
            var user = {
                "socket_id": socket.id,
                "username": username,
                "adsrunning": 0,
                "adsid": [
                    {
                        socket_id: "12233333"
                    }
                ]
            }
            users.push(user);
        }
    });
    console.log(users);
    console.log("on connect " + adsrunning);
    socket.on("click", (username) => {
        console.log(username);
        let currentuser;
        function finduser() {

            for (i = 0; i < users.length; i++) {
                if (users[i].username === username) {
                    currentuser = users[i];
                }
            }
            if (!currentuser) {
                finduser();
            }
        }
        finduser();
        // let currentuser = users.find(o => o.username === username);
        console.log(currentuser);
        if (currentuser.adsrunning === 0) {

            socket.on("timer", (time, ad_id, username) => {
                currentad = socket.id;
                currentad_id = ad_id;
                // let currentuser = users.find({
                //     username: username
                // });

                let currentuser = users.find(o => o.username === username);
                console.log("user ", currentuser, " ", users)
                socket.to(currentuser.socket_id).emit("viewer-time", time, ad_id);
                if (time == 0) {
                    socket.to(currentuser.socket_id).emit("message", "", currentad_id);
                    socket.to(currentuser.socket_id).emit("ad_done", ad_id, socket.id);
                    addone = true;
                    var watchedad = {
                        ad_id: ad_id,
                        watchedAt: Date.now()
                    }
                    const savingad = async function () {
                        const userwatchedads = await WatchedAds_Data.findOne({
                            username: username
                        });
                        userwatchedads.watched_ads.push(watchedad);
                        await userwatchedads.save();
                    }
                    savingad();
                }
            })
        }
        else {
            console.log(socket.id)
            io.to(socket.id).emit("already", true);
        }
    })

    socket.on("disconnect", () => {
        if (socket.type == "ad") {
            let currentuser = users.find(o => {
                for (let i = 0; i < (o.adsid).length; i++) {
                    if (o.adsid[i].socket_id === socket.id) {
                        console.log("users socketid = " + o.adsid[i].socket_id);
                        console.log(o.adsid);
                        o.adsid.splice(i);
                        console.log(o.adsid);
                        return true
                    };

                }
            });
            console.log(currentuser);
            var index = users.indexOf(currentuser);
            currentuser.adsrunning -= 1;
            if (index !== -1) {
                users[index] = currentuser;
            }
        }

        else if (socket.id === currentad) {
            if (addone == false) {
                socket.broadcast.emit("message", "you closed page earlier", currentad_id);
            }
        }
    })
})
app.get("/ad", auth, async (req, res) => {
    if (!req.query) {
        res.redirect("/viewads")
    }
    else {
        const ad = await Ads_Data.findOne({
            ad_id: req.query.ID
        })
        res.status(200).render('ad', {
            ad,
            currentUser: req.currentUser
        });

    }
});
app.get("/surveys", auth, (req, res) => {
    res.status(200).render('surveys', {
        currentUser: req.currentUser,
        currentUserDeposits: req.currentUserDeposits,
        currentUserWithdrawls: req.currentUserWithdrawls
    });
});

app.get("/surveydone", cors(), (req, res) => {
    console.log(req.query);
    return 1
});
app.get("/setting", auth, (req, res) => {
    res.status(200).render('setting', {
        currentUser: req.currentUser,
        currentUserDeposits: req.currentUserDeposits,
        currentUserWithdrawls: req.currentUserWithdrawls
    });
});
app.get("/help", auth, (req, res) => {
    res.status(200).render('help',{currentUser: req.currentUser})
});
app.post("/save-profile", auth, async (req, res) => {
    let avatar = req.body.avatar;
    let name = req.body.name;
    let email = req.body.email;
    let currentUser = req.currentUser;
    let validemail = false;
    let emailchanged = false;
    if (!avatar) {
        avatar = "1";
    }
    console.log({ avatar, name, email, emailStatus: "UNVERIFIED", account: "UNVERIFIED" });
    if (email !== currentUser.email) {
        emailchanged = true;
        const existemail = await User.findOne({
            email
        });
        if (!existemail) {
            validemail = true;
            if ((Date.now() - currentUser.createdAt) > 2592000000) {
                let emailvalidate = validator.validate(req.body.email);
                if (emailvalidate == true) {
                    await User.updateOne({
                        username: currentUser.username
                    }, { $set: { avatar, name, email, phone, emailStatus: "UNVERIFIED", account: "UNVERIFIED" } });
                    res.send("success");
                }
                else {
                    res.send("Invalid Email Address");
                }
            }
            else {
                res.send("Your account must be a month old to change email address");
            }
        }
        else {
            res.send("This email is already used by another user");
        }
    }
    else {
        validemail = true;
        await User.updateOne({
            username: currentUser.username
        }, { $set: { avatar, name } });
        res.send("success");

    }
});

app.get("/withdrawl/easypaisa", auth, (req, res) => {
    res.status(200).render('easypaisa-with', {
        currentUser: req.currentUser
    });
});
app.get("/withdrawl/jazzcash", auth, (req, res) => {
    res.status(200).render('jazzcash-with', {
        currentUser: req.currentUser
    });
});
app.get("/withdrawl/tronlink", auth, (req, res) => {
    res.status(200).render('tron-with', {
        currentUser: req.currentUser
    });
});
app.get("/deposit", auth, (req, res) => {
    res.status(200).render('deposit', {
        currentUser: req.currentUser,
        currentUserDeposits: req.currentUserDeposits
    });
});
app.get("/deposit/easypaisa", auth, (req, res) => {
    res.status(200).render('easypaisa-dep', {
        currentUser: req.currentUser
    });
});
app.get("/deposit/jazzcash", auth, (req, res) => {
    res.status(200).render('jazzcash-dep', {
        currentUser: req.currentUser
    });
});
app.get("/deposit/tronlink", auth, async (req, res) => {
    let pkrtrx;
    await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/trx/pkr.json`, { method: 'GET' }).then(res => res.json())
        .then(json => pkrtrx = json.pkr)
        .catch(err => console.error('error:' + err));
    let GOTprice = (5 / pkrtrx).toFixed(3);
    res.status(200).render('tron-dep', {
        currentUser: req.currentUser, GOTprice
    });
});
app.get("/logout", auth, async (req, res) => {
    const token = req.token;
    const currentUser = req.currentUser
    currentUser.tokens = currentUser.tokens.filter((currentElem) => {
        return currentElem.token !== token
    })
    await currentUser.save();
    res.clearCookie("jwtoken");
    res.redirect('/login');
});
app.get("/dashboard", auth, async (req, res) => {
    res.status(201).render('dashboard', {
        currentUser: req.currentUser,
        currentUserRef: req.currentUserRef
    });

});
app.get("/activate-account", auth, async (req, res) => {
    res.status(201).render('activateaccount', {
        currentUser: req.currentUser,
        currentUserRef: req.currentUserRef
    });

});
app.get("/getactivity", auth, async (req, res) => {
    let deposithistory = req.currentUserDeposits;
    deposithistory = JSON.parse(JSON.stringify(deposithistory));
    let withdrawlhistory = req.currentUserWithdrawls;
    withdrawlhistory = JSON.parse(JSON.stringify(withdrawlhistory));
    let referralhistory = await Referral_history.find({username: req.currentUser.username});
    referralhistory = JSON.parse(JSON.stringify(referralhistory));
    let activityhistory = await Activity_history.find({username: req.currentUser.username});
    activityhistory = JSON.parse(JSON.stringify(activityhistory));
    deposithistory.forEach(history=>{
        history.type = "Deposited";
        history.info = history.transaction_id;
        history.ID = history.depositID;
        history.negative = false;
        history.amount = (parseFloat(history.amount)/parseFloat(history.tprice));
    })
    withdrawlhistory.forEach(history=>{
        history.type = "Withdrawl";
        history.info = history.Account_Number;
        history.negative = true;
        history.ID = history.withdrawID;
    })
    referralhistory.forEach(history=>{
        history.type = "Referral Activity";
        history.info = history.referral;
        history.status = history.action;
        history.negative = false;
        history.amount = history.reward;
    })
    activityhistory.forEach(history=>{
        history.type = "User Activity";
        history.status = history.action;
        history.amount = history.reward;
    })
    let activity = deposithistory.concat(withdrawlhistory, referralhistory, activityhistory)
    activity.sort((a,b)=>{
        return Date.parse(b.date)-Date.parse(a.date)
    })
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    activity.forEach(a=>{
        let d = new Date(a.date);
        let date = d.getDate()>9?d.getDate():`0${d.getDate()}`;
        a.date = `${date}-${months[d.getMonth()]}-${d.getFullYear()}`;

    })
    res.send({
        activity
    });

});
app.post("/activate-account", auth, async (req, res) => {
    const otp = req.body.otp;
    const username = req.currentUser.username;
    const otpexist = await OTPVerification.findOne({
        username,
        otp
    });
    if (!otpexist) {
        res.send("Invalid Code");
    }
    else {
        await OTPVerification.deleteMany({
            username
        });
        await User.updateOne({
            username
        },
            {
                $set: {
                    account: "VERIFIED"
                }
            });
        const referrer = await User.findOne({
            referralID: req.currentUser.referrerID
        });
        if (referrer) {
            const pkg = referrer.plan;
            var referreravailableBalance = referrer.availableBalance;
            let reward = 0;
            referreravailableBalance = parseFloat(referreravailableBalance);
            if (pkg === "FREE") {
                reward = 0.4;
            }
            else if (pkg === "STANDARD") {
                reward = 1;
            }
            else if (pkg === "PREMIUM") {
                reward = 1.5;
            }
            referreravailableBalance += reward;
            referreravailableBalance = referreravailableBalance.toFixed(3);
            referreravailableBalance = referreravailableBalance.toString();
            await User.updateOne({
                username: referrer.username
            },
                {
                    $set: {
                        availableBalance: referreravailableBalance
                    }
                });
            var ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
            var existID = await Referral_history.findOne({
                ID
            });

            if (!existID) {
                ID = ID;
            }
            else {
                ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                checkuserIDexist(ID);
            }
            async function checkuserIDexist(ID) {
                existID = await Referral_history.findOne({
                    ID
                });
                if (!existID) {
                    ID = ID;
                }
                else {
                    ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                    checkuserIDexist(ID);
                }
            };
            let newHistory = new Referral_history({
                ID,
                email: referrer.email,
                username: referrer.username,
                action: "ACCOUNT VERIFIED",
                reward,
                referral: req.currentUser.username,
                date: new Date() 

            })
            await newHistory.save();
        }
        res.send("Successfully Verified");
    }
});
app.get("/packages", auth, async (req, res) => {
    res.status(201).render('packages', {
        currentUser: req.currentUser,
        currentUserRef: req.currentUserRef
    });

});
app.get("/leaderboard", auth, async (req, res) => {
    var users = await User.find();
    var boardarr = [];
    users.forEach(user => {
        var userdata = {
            username: user.username,
            balance: Number(user.availableBalance),
            invitedUsers: user.referralCount
        }
        boardarr.push(userdata);
    });
    boardarr.sort((a, b) => {
        return b.balance - a.balance
    })
    console.log(boardarr);
    var userrank = boardarr.find(data => data.username === req.currentUser.username);
    userrank.rank = boardarr.indexOf(userrank) + 1;
    console.log(userrank);
    res.status(201).render('leaderboard', {
        currentUser: req.currentUser,
        currentUserRef: req.currentUserRef,
        boardarr,
        userrank
    });

});
app.get("/resendotp", async (req, res) => {
    const username = req.cookies.user;
    const finduser = await User.findOne({
        username: username
    });
    const email = finduser.email;
    sendOTPverificationEmail({ username, email }, res);
    res.status(201).send("resent");

});
app.post("/sendotp", async (req, res) => {
    const email = req.body.email;
    const finduser = await User.findOne({
        email: email
    });
    const username = finduser.username;
    sendOTPverificationEmail({ username, email }, res)
    res.status(201).send("resent");

});
app.get("/forgetpassword", async (req, res) => {
    res.status(201).render('forgetpassword');

});
app.get("/setnewpassword", async (req, res) => {
    let hash = req.query.hash;
    let existkey = await NewPass_Req.findOne({
        hash
    })
    if(!existkey || existkey.expiredAt<Date.now()){
        res.redirect("/forgetpassword");
    }
    else{
        res.status(201).render('setnewpassword');
    }

});
app.post("/forgetpassword", async (req, res) => {
    const email = req.body.email;
    console.log(email);
    const existemail = await User.findOne({
        email: email
    });
    if (!existemail) {
        res.send("Email not available");
    }
    else {
        const username = existemail.username
        res.cookie("user", username);
        sendOTPverificationEmail({ username, email }, res)
            .then(() => {
                res.send("email sent");
            }).catch((err) => {
                res.send("email can't sent");
            });
    }

});
app.post("/setnewpassword", async (req, res) => {
    var newpassword = req.body.newpassword;
    const newconfirmpassword = req.body.newconfirmpassword;
    const username = req.cookies.user;
    if (newpassword < 8) {
        res.send("password must be 8 characters long")
    }
    else if (newpassword == newconfirmpassword) {
        newpassword = bcrypt.hashSync(newpassword, salt);
        await User.updateOne({
            username: username
        }, { $set: { password: newpassword } });
        res.clearCookie("user");
        res.send("password set");
    }
    else {
        res.send("passwords not matching");
    }


});
app.post("/checkcode", async (req, res) => {
    const email = req.body.email;
    const code = req.body.otp;
    const hash =  '_' + Math.random().toString(36).substr(2, 9);
    const existcode = await OTPVerification.findOne({
        otp: code,
        email: email
    })
    if (!existcode) {
        res.send({message: "Wrong Code"});
    }
    else {
        const req = new NewPass_Req({
            username: existcode.username,
            hash,
            createdAt: Date.now(),
            expiredAt: Date.now()+1800000
        })
        await req.save();
        res.send({message:"code verified", hash})
    }

});
app.post("/buypkg", auth, async (req, res) => {
    console.log(req.body);
    let pkgduration = parseFloat(req.body.pkgduration);
    let planAvailed = req.currentUser.planAvailed;
    let planExpiry = req.currentUser.planExpiry;
    let moneyBack = 0;
    if(req.body.action=="Buy Package"){
        planAvailed = Date.now();
        planExpiry = planAvailed + pkgduration;
    }
    else{
        if(req.currentUser.plan=="STANDARD" && req.body.selectedpkg=="PREMIUM"){
            let canceledDays = 0;
            let oldPkg = 0;
            oldPkg = Math.round(((planExpiry-planAvailed)/2592000000));
            planAvailed = Date.now();
            canceledDays = Math.round((planExpiry-planAvailed)/86400000);
            planExpiry = planAvailed+pkgduration;
            let price;
            if(oldPkg==1){
                price = 20/31;
            }
            else if(oldPkg==2 || oldPkg==3){
                price = 39/61;
            }
            else if(oldPkg>3 && oldPkg<9){
                price = 110/181;
            }
            else{
                price = 200/361;
            }
            moneyBack=canceledDays*price;
            var ID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                var existID = await Activity_history.findOne({
                    ID
                });
    
                if (!existID) {
                    ID = ID;
                }
                else {
                    ID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                    checkuserIDexist(ID);
                }
                async function checkuserIDexist(ID) {
                    existID = await Activity_history.findOne({
                        ID
                    });
                    if (!existID) {
                        ID = ID;
                    }
                    else {
                        ID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                        checkuserIDexist(ID);
                    }
                };
            let activity = new Activity_history({
                ID,
                email: req.currentUser.email,
                username: req.currentUser.username,
                action: "PACKAGE REVERTED",
                reward: moneyBack,
                info: "STANDARD",
                negative: false,
                date: Date.now()
            })
            await activity.save();
            }
            else{
            planExpiry = Date.parse(planExpiry)+pkgduration;}
        }
        var aID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                var existaID = await Activity_history.findOne({
                    aID
                });
    
                if (!existaID) {
                    aID = aID;
                }
                else {
                    aID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                    checkuserIDexist(aID);
                }
                async function checkuserIDexist(aID) {
                    existaID = await Activity_history.findOne({
                        aID
                    });
                    if (!existaID) {
                        aID = aID;
                    }
                    else {
                        aID = `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
                        checkuserIDexist(aID);
                    }
                };
        let newActivity = new Activity_history({
            ID: aID,
            email: req.currentUser.email,
            username: req.currentUser.username,
            action: "PKG PURCHASED",
            reward: req.body.reqprice,
            info: req.body.selectedpkg,
            negative: true,
            date: new Date() 

        })
        await newActivity.save();
        let availableBalance = parseFloat(req.body.availbalance) - parseFloat(req.body.reqprice) + moneyBack;
    availableBalance = Number(availableBalance).toFixed(3);
    await User.updateOne({
        username: req.currentUser.username
    },
        { $set: { availableBalance, plan: req.body.selectedpkg, planAvailed, planExpiry } }
    );
    let referrerID = req.currentUser.referrerID;
    let referrer = await User.findOne({referralID: referrerID})
    let referralReward = 0;
    if(referrer){
        switch(referrer.plan){
            case "FREE":{
                referralReward = (parseFloat(req.body.reqprice)/100)*20;
                break;
            }
            case "STANDARD":{
                referralReward = (parseFloat(req.body.reqprice)/100)*50;
                break;
            }
            case "PREMIUM":{
                referralReward = (parseFloat(req.body.reqprice)/100)*80;
                break;
            }
        }

        let bal = parseFloat(referrer.availableBalance)+referralReward;
        await User.updateOne({
            username: referrer.username
        },
            { $set: { availableBalance: bal} }
        );
        var ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                var existID = await Referral_history.findOne({
                    ID
                });
    
                if (!existID) {
                    ID = ID;
                }
                else {
                    ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                    checkuserIDexist(ID);
                }
                async function checkuserIDexist(ID) {
                    existID = await Referral_history.findOne({
                        ID
                    });
                    if (!existID) {
                        ID = ID;
                    }
                    else {
                        ID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                        checkuserIDexist(ID);
                    }
                };
                
                let newHistory = new Referral_history({
                    ID,
                    email: referrer.email,
                    username: referrer.username,
                    action: "PKG PURCHASED",
                    reward: referralReward,
                    referral: req.currentUser.username,
                    date: new Date() 
    
                })
                await newHistory.save();

    }
    res.send("Successfully Purchased");
});
app.post("/createads", auth, async (req, res) => {
    var availableBalance = Number(req.currentUser.availableBalance);
    if (availableBalance > Number(req.body.totalcharges)) {
        var ad_id = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        var existad_id = await Ads_Data.findOne({
            ad_id: ad_id
        });

        if (!existad_id) {
            req.body.ad_id = ad_id;
        }
        else {
            ad_id = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            checkuserIDexist(ad_id);
        }
        async function checkuserIDexist(ad_id) {
            existad_id = await Ads_Data.findOne({
                ad_id: ad_id
            });
            if (!existad_id) {
                req.body.ad_id = ad_id;
            }
            else {
                ad_id = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
                checkuserIDexist(ad_id);
            }
        };
        req.body.username = req.currentUser.username;
        req.body.createdAt = Date.now();
        req.body.clickdone = 0;
        req.body.status = "RUNNING";
        availableBalance = availableBalance - req.body.totalcharges;
        availableBalance = Number(availableBalance).toFixed(3);
        await User.updateOne({
            availableBalance: availableBalance
        });
        console.log(req.body);
        const newad = await new Ads_Data(req.body);
        await newad.save();
        res.send("Ad Added");
    }
    else {
        res.send("Not Enough Balance");
    }
});
app.get("/gettrx", auth, async (req, res) => {
    let pkrtrx;
    await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/trx/pkr.json`, { method: 'GET' }).then(res => res.json())
        .then(json => pkrtrx = json.pkr)
        .catch(err => console.error('error:' + err));
    let GOTprice = (5 / pkrtrx).toFixed(3);
    res.send({ GOTprice })
});
app.post("/easypaisa-dep", auth, async (req, res) => {
    const TrxID = req.body.TrxID;
    const amount = req.body.amount;
    let depositID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    var existdepositID = await Deposit_Data.findOne({
        depositID: depositID
    });

    if (!existdepositID) {
        depositID = depositID;
    }
    else {
        depositID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        checkuserIDexist(depositID);
    }
    async function checkuserIDexist(depositID) {
        existdepositID = await Deposit_Data.findOne({
            depositID: depositID
        });
        if (!existdepositID) {
            depositID = depositID;
        }
        else {
            depositID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            checkuserIDexist(depositID);
        }
    };
    let minimum = 100;
    let tprice = 5;
    if (req.body.method == "tronlink") {
        await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/trx/pkr.json`, { method: 'GET' }).then(res => res.json())
        .then(json => tprice = 5/json.pkr)
        .catch(err => console.error('error:' + err));
        minimum = 7
    }
    if (!TrxID) {
        res.send("TrxID empty");
    }
    else {
        if (!amount) {
            res.send("amount empty");
        }
        else if (amount < minimum) {
            res.send("less 100");
        }
        else {
            const newUserDepositData = new Deposit_Data({
                depositID,
                email: req.currentUser.email,
                username: req.currentUser.username,
                transaction_id: TrxID,
                amount: amount,
                method: req.body.method,
                tprice,
                date: Date.now(),
                status: "PENDING"
            })

            await newUserDepositData.save();
            res.status(200).send("Transaction Added")
        }
    }

});
app.post("/easypaisa-with", auth, async (req, res) => {
    const minimum = req.currentUser.minimum;
    const amount = Number(req.body.amount);
    const availableBalance = Number(req.currentUser.availableBalance);
    let withdrawID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    var existwithdrawID = await Withdrawl_Data.findOne({
        withdrawID: withdrawID
    });

    if (!existwithdrawID) {
        withdrawID = withdrawID;
    }
    else {
        withdrawID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        checkuserIDexist(withdrawID);
    }
    async function checkuserIDexist(withdrawID) {
        existwithdrawID = await Withdrawl_Data.findOne({
            withdrawID: withdrawID
        });
        if (!existwithdrawID) {
            withdrawID = withdrawID;
        }
        else {
            withdrawID = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
            checkuserIDexist(withdrawID);
        }
    };
    var newUserWithdrawlData;
    if (req.body.method !== "tronlink" && !req.body.EPname) {

        res.send("EPname empty");
    }
    else if (!req.body.EPnumber) {
        res.send("EPnumber empty");
    }
    else if (!amount) {
        res.send("amount empty");
    }
    else if (amount < minimum) {
        res.send("less minimum");
    }
    else if (availableBalance < amount) {
        res.send("Not Enough")
    }
    else {
        if (req.body.method == "tronlink") {
            newUserWithdrawlData = new Withdrawl_Data({
                withdrawID,
                email: req.currentUser.email,
                username: req.currentUser.username,
                Account_Number: req.body.EPnumber,
                amount: amount,
                method: req.body.method,
                date: Date.now(),
                status: "PENDING"
            })
        }
        else {
            newUserWithdrawlData = new Withdrawl_Data({
                withdrawID,
                email: req.currentUser.email,
                username: req.currentUser.username,
                Account_Name: req.body.EPname,
                Account_Number: req.body.EPnumber,
                amount: amount,
                method: req.body.method,
                date: Date.now(),
                status: "PENDING"
            })
        }
        req.currentUser.availableBalance = availableBalance - amount;
        let abal = Number(req.currentUser.availableBalance);
        let wbal = Number(req.currentUser.withdrawnBalance);
        req.currentUser.availableBalance = abal.toFixed(3);
        wbal = (wbal + amount);
        wbal = wbal.toFixed(3);
        await User.updateOne({
            username: req.currentUser.username
        }, {
            $set: { availableBalance: req.currentUser.availableBalance, withdrawnBalance: wbal }
        });
        await newUserWithdrawlData.save();
        res.status(200).send("Transaction Added")
    }

});
app.post("/login", async (req, res) => {
    console.log(req.body);
    let token;
    const username = req.body.username;
    const password = req.body.password;
    if (!username) {
        res.send("Username can't be Empty");

    }
    else if (!password) {
        res.send("Password can't be Empty");
    }
    else {
        const userAccount = await User.findOne({
            username: username
        });
        if (!userAccount) {
            res.send("Account with this username is not available");
        }
        else {
            const verifypassword = bcrypt.compareSync(password, userAccount.password);
            // const verifypassword = password === userAccount.password;
            if (verifypassword == false) {
                res.send("Wrong Password");
            }
            else {
                if (userAccount.emailStatus === "UNVERIFIED") {
                    res.send("email unverified")
                }
                else {
                    token = await userAccount.generateAuthToken();
                    res.cookie("jwtoken", token, {
                        expires: new Date(Date.now() + 259200000),
                        httpOnly: true
                    });
                    res.send("Account Logged In");
                }
            }
        }
    }
});
app.post("/registers", async (req, res) => {
    try {
        console.log(req.body);
        var referralID = `${Math.floor(1000000 + Math.random() * 9000000)}`;
        var userID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
        req.body.referralCount = 0;
        req.body.availableBalance = "0";
        req.body.depositedBalance = "0";
        req.body.withdrawnBalance = "0";
        req.body.referralEarned = "0";
        req.body.Earned = "0";
        req.body.plan = "FREE";
        req.body.emailStatus = "UNVERIFIED";
        req.body.phoneStatus = "UNVERIFIED";
        req.body.account = "UNVERIFIED";
        req.body.avatar = "0";
        req.body.planAvailed = Date.now();
        req.body.planExpiry = Date.now()+315600000000;
        req.body.createdAt = Date.now();
        console.log("this=>", req.body);
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const email = req.body.email;
        const name = req.body.name;
        const username = req.body.username;
        const phone = req.body.phone;
        var existReferrerID;
        var emptyreferrerID;
        let emailvalidate = validator.validate(req.body.email);
        if (emailvalidate == true) {
            if (!req.body.referrerID) {
                emptyreferrerID = true;
                console.log("refererer", existReferrerID, emptyreferrerID);
            }
            else {
                existReferrerID = await User.findOne({
                    referralID: req.body.referrerID
                });
            }
            if (existReferrerID || emptyreferrerID === true) {
                var existuserID = await User.findOne({
                    userID: userID
                });

                if (!existuserID) {
                    req.body.userID = userID;
                }
                else {
                    userID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                    checkuserIDexist(userID);
                }
                function checkuserIDexist(userID) {
                    existuserID = User.findOne({
                        userID: userID
                    });
                    if (!existuserID) {
                        req.body.userID = userID;
                    }
                    else {
                        userID = `${Math.floor(100000000 + Math.random() * 900000000)}`;
                        checkuserIDexist(userID);
                    }
                };


                var existReferralID = await User.findOne({
                    referralID: referralID
                });

                if (!existReferralID) {
                    req.body.referralID = referralID;
                }
                else {
                    referralID = `${Math.floor(1000000 + Math.random() * 9000000)}`;
                    checkreferralIDexist(referralID);
                }
                function checkreferralIDexist(referralID) {
                    existReferralID = User.findOne({
                        referralID: referralID
                    });
                    if (!existReferralID) {
                        req.body.referralID = referralID;
                    }
                    else {
                        referralID = `${Math.floor(1000000 + Math.random() * 9000000)}`;
                        checkreferralIDexist(referralID);
                    }
                };
                if (!name) {
                    res.send("Name can't be Empty");

                }
                else if (!email) {
                    res.send("Email can't be Empty");

                }
                else if (!username) {
                    res.send("Username can't be Empty");

                }
                else if (!phone) {
                    res.send("Phone Number can't be Empty");

                }
                else if (!password) {
                    res.send("Password can't be Empty");

                }
                else if (!cpassword) {
                    res.send("Confirm Password can't be Empty");

                }
                else {
                    const existemailuser = await User.findOne({
                        email: email
                    });
                    var existemail = false;
                    console.log(existemailuser);
                    if (!existemailuser) {
                        const existusernameuser = await User.findOne({
                            username: username
                        });
                        var existusername = false;
                        if (!existusernameuser) {
                            const existPhoneuser = await User.findOne({
                                phone: phone
                            });
                            var existPhone = false;
                            if (!existPhoneuser) {
                                existPhone = false;
                            }
                            else {
                                existPhone = true;
                            }
                        }
                        else {
                            existusername = true;
                        }
                    }
                    else {
                        existemail = true;
                    }


                    console.log("open=>" + existemailuser);
                    if (existemail == true) {
                        res.send("Email Already Existed")
                    }
                    else if (existPhone == true) {
                        res.send("Phone Number Already Existed")
                    }
                    else if (existusername == true) {
                        res.send("Username Already Existed")
                    }
                    else {
                        if (password.length < 8) {
                            res.send("password must be 8 characters long");
                        }
                        else if (password == cpassword) {
                            const secretpassword = bcrypt.hashSync(password, salt);
                            req.body.password = secretpassword;
                            delete req.body.confirmpassword;
                            console.log(req.body);
                            const newUserReferralData = new UserReferralData({
                                email: email,
                                username: username,
                                referralID: referralID,
                                referralCount: 0,
                                referrals: [],
                                plan: req.body.plan
                            })

                            await newUserReferralData.save();
                            const RegisterUserr = User(req.body)
                            await RegisterUserr.save()
                                .then(() => {
                                    res.cookie("user", username);
                                    sendOTPverificationEmail({ username, email }, res);
                                    // res.render("otpverify.pug");
                                    res.send("Email Sent");
                                })
                                .catch(err => {
                                    console.log("opening in error  =>" + err);
                                    res.status(400).send("unable to save to database " + err);
                                });

                        }
                        else {
                            res.send("password & confirmpassword don't match")
                        }
                    }

                }

            }
            else {
                res.send("Referral ID does not exist");
            }
        }
        else {
            res.send("invalid email format");
        }
    }
    catch (error) {
        console.log("Error Showing" + error);
        res.status(400).send(error);
    }
});



const sendOTPverificationEmail = async ({ username, email }, res) => {
    try {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jhonewalen@gmail.com',
                pass: "bmfmhiffgyvburbl"
            },
            port: 465,
            host: 'smtp.gmail.com'
        });
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const mailOptions = {
            from: '"Our Website" <ourwebsite@example.com>',
            to: email,
            subject: "Verify Your Email",
            html: `<div style="width: 100%; height: 100%; padding: 1px 0px; background: #d5d2d2; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">
            <div style="margin: 70px; background: #ffffff; border-radius: 20px;">
    
                <h1 style="text-align: center;padding-top: 15px;">Email Verification</h1>
                <p style="padding: 20px;">
                    Dear <strong>${username}</strong>,<br>
                You are just one step away from the GetsOkay account registration. <br><br>
                <strong>OTP Code:</strong> <strong style="background: #beebac; font-size: 35px; padding: 5px 10px; border-radius: 14px; margin-left: 20px;">${otp}</strong><br>
                The above OTP is only valid for 10 minutes.
    
                </p>
            </div>
        </div>`
        };
        await OTPVerification.deleteMany({
            username
        });
        const newOTPverificationcode = new OTPVerification({
            username: username,
            email: email,
            otp: otp,
            createdAt: Date.now(),
            expiredAt: Date.now() + 600000
        })
        await newOTPverificationcode.save();
        await transporter.sendMail(mailOptions);
        console.log("sent\n", mailOptions);
    } catch (error) {
        console.log("Can't sent" + error);
    }
}

app.post("/verifyotp", async (req, res) => {
    try {
        console.log("opti=> " + req.body.otp);
        const username = req.cookies.user;
        const otpdata = await OTPVerification.findOne({
            otp: req.body.otp,
            username: username
        });
        console.log("this=> " + otpdata)
        if (!otpdata) {
            res.send("Wrong OTP");
            res.status(400);
            console.log("Wrrong OTP");
        }
        else {
            if (otpdata.expiredAt < Date.now()) {
                console.log("OTP expired");
                await OTPVerification.deleteOne({
                    otp: req.body.otp
                })
            }
            else {
                await User.updateOne(
                    { email: otpdata.email },
                    { $set: { 'emailStatus': "VERIFIED" } }

                )

                await OTPVerification.deleteOne({
                    otp: req.body.otp
                })
                const currentuser = await User.findOne({
                    email: otpdata.email
                });
                if (!currentuser.referrerID) {
                    console.log("ReferrerID not entered");
                }
                else {
                    var referrer = await UserReferralData.findOne({
                        referralID: currentuser.referrerID
                    });
                    var referrerUser = await User.findOne({
                        referralID: currentuser.referrerID
                    });
                    referrer.referralCount += 1;
                    var referralemail = currentuser.email;
                    var referrer_referrals = referrer.referrals;
                    referrer_referrals.push(referralemail);
                    await User.updateOne(
                        { referralID: currentuser.referrerID },
                        { $set: { referralCount: referrer.referralCount } })
                    await UserReferralData.updateOne(
                        { referralID: currentuser.referrerID },
                        { $set: { 'referrals': referrer_referrals, referralCount: referrer.referralCount } })
                        .then(() => {
                            referrer = UserReferralData.findOne({
                                referralID: currentuser.referrerID
                            });
                        }).catch((err) => {
                            console.log("error", err);

                        });
                }

                token = await currentuser.generateAuthToken();
                res.cookie("jwtoken", token, {
                    expires: new Date(Date.now() + 259200000),
                    httpOnly: true
                });
                res.clearCookie("user");
                res.status(200);
                res.send("Successfully verified");
            }



        }
    } catch (error) {
        console.log(error);
    }
});


// <--ADMIN PANEL-->
app.get("/admin/dashboard", admin_auth, async (req, res) => {
    let total_earned = 0;
    req.Users.forEach(user => {
        total_earned += Number(user.availableBalance);
    });
    let new_users = 0;
    req.Users.forEach(user => {
        if ((Date.now() - user.createdAt) < 86400000) {
            new_users += 1;
        }
    });
    res.status(201).render('admin-dashboard', {
        Users: req.Users,
        Referrals: req.Referrals,
        total_earned,
        new_users
    });

});
app.get("/admin/users", admin_auth, async (req, res) => {
    const users = await User.find();
    res.render("users-info", {
        users
    })
});
app.get("/admin/users-info", admin_auth, async (req, res) => {
    const users = await User.find();
    res.send({
        users
    })
});
app.get("/admin/edit", admin_auth, async (req, res) => {
    const user = await User.findOne({
        userID: req.query.user
    });
    res.render("user-data-edit", {
        user
    });
})
app.get("/admin/message", admin_auth, async (req, res) => {
    const user = await User.findOne({
        userID: req.query.user
    });
    res.render("admin-message", {
        user
    });
})
app.get("/admin/view", admin_auth, async (req, res) => {
    const user = await User.findOne({
        userID: req.query.user
    });
    const userDeposits = await Deposit_Data.find({
        username: user.username
    })
    const userWithdrawls = await Withdrawl_Data.find({
        username: user.username
    })
    const userReferrals = await User.find({
        referrerID: user.referralID
    });
    res.render("user-data", {
        user,
        userDeposits,
        userWithdrawls,
        userReferrals
    });
})
app.post("/admin/get-userdata", admin_auth, async (req, res) => {
    const user = await User.findOne({
        userID: req.body.userID
    });
    const userDeposits = await Deposit_Data.find({
        username: user.username
    });
    const userWithdrawls = await Withdrawl_Data.find({
        username: user.username
    });
    const userReferrals = await User.find({
        referrerID: user.referralID
    });
    res.send({
        user,
        userDeposits,
        userWithdrawls,
        userReferrals
    });
})
app.post("/admin/save-user", admin_auth, async (req, res) => {
    const userID = req.body.userID;
    const username = req.body.username;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const plan = req.body.plan;
    const emailStatus = req.body.emailStatus;
    const account = req.body.account;
    const createdAt = req.body.createdAt;
    const availableBalance = req.body.availableBalance;
    const withdrawnBalance = req.body.withdrawnBalance;
    const depositedBalance = req.body.depositedBalance;
    const referralID = req.body.referralID;
    const referrerID = req.body.referrerID;
    const referralCount = req.body.referralCount;
    console.log(req.body);
    await User.updateOne({
        userID
    }, { $set: { userID, username, name, email,plan, phone, emailStatus, account, createdAt, availableBalance, withdrawnBalance, depositedBalance, referralID, referrerID, referralCount } });
    res.send("save successful")
})
app.post("/admin/sendmessage", admin_auth, async (req, res) => {
    const userID = req.body.userID;
    const title = req.body.title;
    const message = req.body.message;
    //console.log({userID, title, message});
    let message_data = new Messages_Data({
        userID,
        title,
        message,
        messagedAt: Date.now(),
        status: "UNREAD"
    });
    await message_data.save();
    res.send("Message Sent");
})
app.get("/admin/deposit", admin_auth, async (req, res) => {
    const deposithistory = await Deposit_Data.find();
    res.render("admin-deposit", {
        deposithistory
    });
})
app.get("/admin/getdeposit", admin_auth, async (req, res) => {
    const deposithistory = await Deposit_Data.find();
    res.send({
        deposithistory
    });
})
app.get("/admin/withdrawl", admin_auth, async (req, res) => {
    const withdrawlhistory = await Withdrawl_Data.find();
    res.render("admin-withdrawl", {
        withdrawlhistory
    });
})
app.get("/admin/getwithdrawl", admin_auth, async (req, res) => {
    const withdrawlhistory = await Withdrawl_Data.find();
    res.send({
        withdrawlhistory
    });
})
app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!")
})
httpServer.listen(port, () => {
    console.log(`Hey, Your server has started at ${port}`);
})
