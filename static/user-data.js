const host = "https://getsokay.com/admin";
let user;
let userWithdrawls;
let userDeposits;
let userReferrals;
let userSurveys;
const userdata = document.getElementById("user-data");
const deposithistory = document.getElementById("deposithistories");
const withdrawhistory = document.getElementById("withdrawhistories");
const referralshistory = document.getElementById("referralshistories");
const surveyshistory = document.getElementById("surveyshistories");
const historybtns = document.querySelectorAll(".historybtn");

function display(page) {
    userdata.style.display = "none";
    deposithistory.style.display = "none";
    withdrawhistory.style.display = "none";
    referralshistory.style.display = "none";
    surveyshistory.style.display = "none";
    page.style.display = "flex";
}

function active(btn) {
    historybtns.forEach(historybtn => {
        historybtn.style.background = "none";
        historybtn.style.color = "white";
    });
    btn.style.background = "white";
    btn.style.color = "black";
}

let userID = document.getElementById("userID").innerText;
$.post(host+"/get-userdata", 
{
    userID
}
,
function (data, status) {
    user = data.user;
    userWithdrawls = data.userWithdrawls;
    userDeposits = data.userDeposits;
    userReferrals = data.userReferrals;

})

const image = document.getElementById("image");
const avatar = image.getAttribute("avatar");
image.style.background = `url(../static/images/avatar/${avatar}.png)`;
image.style.backgroundRepeat = "no-repeat";
image.style.backgroundPosition = "center";
image.style.backgroundSize = "cover";

function colorbtn(btnbox)
{
const editbtns = document.querySelectorAll(`.${btnbox} button`);
editbtns.forEach(btn => {
    switch(btn.innerHTML){
        case "PENDING":
            btn.style.background =  "#5681eb"; 
            btn.style.boxShadow = "#758c8f 2px 2px 2px 2px";
            break;
        case "APPROVED":
            btn.style.background =  "#5beb56"; 
            btn.style.boxShadow = "#65a367 2px 2px 2px 2px";
            break;
        case "REJECTED":
            btn.style.background =  "#d65c5c"; 
            btn.style.boxShadow = "#7b5259 2px 2px 2px 2px";
            break;
        
    
    }
});
}
function onShowUserData(){
    display(userdata);
    active(historybtns[0])
}
function onShowDepositData(){
    display(deposithistory);
    active(historybtns[1])
    colorbtn("depositedit");
}
function onShowWithdrawlData(){
    display(withdrawhistory);
    active(historybtns[2]);
    colorbtn("withdrawledit");
}
function onShowReferralsData(){
    display(referralshistory);
    active(historybtns[3])
    colorbtn("referraledit");
}
function onShowSurveysData(){
    display(surveyshistory);
    active(historybtns[4])
}