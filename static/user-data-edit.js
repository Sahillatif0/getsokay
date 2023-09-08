const host = "https://getsokay.com/admin"

const image = document.getElementById("image");
const avatar = image.getAttribute("avatar");
function showavatar(avatar){
image.style.background = `url(../static/images/avatar/${avatar}.png)`;
image.style.backgroundRepeat = "no-repeat";
image.style.backgroundPosition = "center";
image.style.backgroundSize = "cover";
}
showavatar(avatar);
const userID_i = document.getElementById("userID-i");
const userID = document.getElementById("userID-field");
const username_i = document.getElementById("username-i");
const username = document.getElementById("username-field");
const name_i = document.getElementById("name-i");
const name = document.getElementById("name-field");
const email_i = document.getElementById("email-i");
const email = document.getElementById("email-field");
const phone_i = document.getElementById("phone-i");
const phone = document.getElementById("phone-field");
const emailstatus_i = document.getElementById("emailstatus-i");
const emailstatus = document.getElementById("emailstatus-field");
const account_i = document.getElementById("account-i");
const account = document.getElementById("account-field");
const plan_i = document.getElementById("plan-i");
const plan = document.getElementById("plan-field");
const createdAt_i = document.getElementById("createdAt-i");
const createdAt = document.getElementById("createdAt-field");
const availableBalance_i = document.getElementById("availableBalance-i");
const availableBalance = document.getElementById("availableBalance-field");
const withdrawnBalance_i = document.getElementById("withdrawnBalance-i");
const withdrawnBalance = document.getElementById("withdrawnBalance-field");
const depositedBalance_i = document.getElementById("depositedBalance-i");
const depositedBalance = document.getElementById("depositedBalance-field");
const referralID_i = document.getElementById("referralID-i");
const referralID = document.getElementById("referralID-field");
const referrerID_i = document.getElementById("referrerID-i");
const referrerID = document.getElementById("referrerID-field");
const referralCount_i = document.getElementById("referralCount-i");
const referralCount = document.getElementById("referralCount-field");
function remreadonly(input, i){
    let i_value = i.classList.value.includes("fa-pen");
    if(i_value){
    const boxid = input.getAttribute("name");
    const box = document.getElementById(`${boxid}box`);
    box.style.border = "2px solid #38bbc9"
    input.removeAttribute("readonly");
    input.focus();
    i.classList.replace("fa-pen", "fa-check");
    console.log(i.classList)}
    else{
        const boxid = input.getAttribute("name");
        const box = document.getElementById(`${boxid}box`);
        box.style.border = "none"
        input.setAttribute("readonly", true);
        i.classList.replace("fa-check", "fa-pen");
    }
}
userID_i.addEventListener("click", function(){remreadonly(userID, userID_i);});
username_i.addEventListener("click", function(){remreadonly(username, username_i);});
name_i.addEventListener("click", function(){remreadonly(name, name_i);});
email_i.addEventListener("click", function(){remreadonly(email, email_i);});
phone_i.addEventListener("click", function(){remreadonly(phone, phone_i);});
emailstatus_i.addEventListener("click", function(){remreadonly(emailstatus, emailstatus_i);});
account_i.addEventListener("click", function(){remreadonly(account, account_i);});
plan_i.addEventListener("click", function(){remreadonly(plan, plan_i);});
createdAt_i.addEventListener("click", function(){remreadonly(createdAt, createdAt_i);});
availableBalance_i.addEventListener("click", function(){remreadonly(availableBalance, availableBalance_i);});
withdrawnBalance_i.addEventListener("click", function(){remreadonly(withdrawnBalance, withdrawnBalance_i);});
depositedBalance_i.addEventListener("click", function(){remreadonly(depositedBalance, depositedBalance_i);});
referralID_i.addEventListener("click", function(){remreadonly(referralID, referralID_i);});
referrerID_i.addEventListener("click", function(){remreadonly(referrerID, referrerID_i);});
referralCount_i.addEventListener("click", function(){remreadonly(referralCount, referralCount_i);});
let selected;
function changeavatar(){
    selected = prompt("Type the avatar number");
    showavatar(selected);
}
function onCancel() {
    window.location.href = `${host}/users`
}
function onSave(){
    $.post(host+"/save-user", 
    {
        avatar: selected,
        userID: $("#userID-field").val(),
        username: $("#username-field").val(),
        name: $("#name-field").val(),
        email: $("#email-field").val(),
        phone: $("#phone-field").val(),
        emailStatus: $("#emailstatus-field").val(),
        account: $("#account-field").val(),
        plan: $("#plan-field").val(),
        createdAt: $("#createdAt-field").val(),
        availableBalance: $("#availableBalance-field").val(),
        withdrawnBalance: $("#withdrawnBalance-field").val(),
        depositedBalance: $("#depositedBalance-field").val(),
        referralID: $("#referralID-field").val(),
        referrerID: $("#referrerID-field").val(),
        referralCount: $("#referralCount-field").val()
    }, function (data, status) {
        const errorbox = document.getElementById("errorbox");
        console.log(errorbox)
        // const error = document.getElementById("error");
        if(data==="save successful"){
            errorbox.style.background = "#2d8640";
            errorbox.style.padding = "18px";
            $("#error").html(data);
            const inputs = document.querySelectorAll(".input");
            inputs.forEach(input=>{
                let attribute = input.getAttribute("readonly")
                if(!attribute || attribute==false){
                    input.setAttribute("readonly", true);
                    let inputid = input.getAttribute("name");
                    const inputbox = document.getElementById(`${inputid}box`);
                    const input_i = document.getElementById(`${inputid}-i`);
                    inputbox.style.border = "none";
                    input_i.classList.replace("fa-check", "fa-pen");
                }
            })
        }
        console.log(data);
        setTimeout(() => {
            errorbox.style.padding = "";
            $("#error").html("");
        }, 2000);
    })
}