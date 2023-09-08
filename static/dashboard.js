var checkBoxdf = document.getElementById("hamburger");
var navbar65 = document.getElementById("navbar");
navbar65.addEventListener("click", function(e){
    console.log("clcikced "+checkBoxdf.checked);
});
let activities;
$.get("/getactivity", function (data, status) {
    activities = data.activity;
    console.log(activities)
    let code = "<h1>Activities</h1>";
    activities.forEach(activity=>{
        let statusColor;
        let amountColor;
        if(activity.status=="PENDING"){
            statusColor = "color: #e49f00";
            amountColor = "color: black";
            activity.amount = parseFloat(activity.amount).toFixed(2)+" GOT";
            
        }
        else if(activity.status=="REJECTED"){
            statusColor = "color: red";
            amountColor = "color: #7020fa";
            activity.amount = "!"+parseFloat(activity.amount).toFixed(2)+" GOT";
        }
        else if(activity.negative==false){
            statusColor = "color: green";
            amountColor = "color: green";
            // amountColor = activity.type=="Withdrawl"?"color: red":"color: green";
            activity.amount ="+"+parseFloat(activity.amount).toFixed(2)+" GOT";
            // activity.amount = activity.type=="Withdrawl"?"-"+parseFloat(activity.amount).toFixed(2)+" GOT":"+"+parseFloat(activity.amount).toFixed(2)+" GOT";
        }
        else if(activity.negative==true){
            statusColor = "color: green";
            amountColor = "color: red";
            activity.amount = "-"+parseFloat(activity.amount).toFixed(2)+" GOT"
        }
        // amountColor = activity.status=="PENDING"?"color: black":"color: green";
        code = code + `<div class="activity" id="${activity.ID}"> <div class="type textbox"> <p>${activity.type}</p></div><div class="info textbox"><p>${activity.info}</p></div><div class="date textbox"><p>${activity.date}</p></div><div class="status textbox"><p style="${statusColor}">${activity.status}</p></div><div class="amount textbox"><p style="${amountColor}">${activity.amount}</p></div></div>`
    })
    $("#Activitiesbox").html(code);
    
})

var submenubar = false;
function onCheckedDesk()
{
    var checkBox = document.getElementById("hamburger-input");
    if(checkBox.checked==true){
        checkinbase(true, "web");
    }
    else if(checkBox.checked==false && submenubar==false){
        checkinbase(false, "web");
}
}
function onCheckedMob(){
    var checkBoxmob = document.getElementById("hamburger");
    
    if(checkBoxmob.checked==true){
        checkinbase(true, "mob");
    }
    else if(checkBoxmob.checked==false){
        checkinbase(false, "mob");
        
    }       
}
submenubar = onSubmenu();


setTimeout(() => {
    const baltexts = document.querySelectorAll(`.balance`);
    const speed = 200;
    baltexts.forEach(baltext => {
    function updatebalance() {
        const target = +baltext.getAttribute("data-target");
        const current = +baltext.innerText;
        let inc = target/speed;
        if (inc<0.009){
            inc *=10;
        }
        if (current<target){
            let bal = (current+inc);
            baltext.innerText = (bal).toFixed(3);
            setTimeout(updatebalance, 10);
        }
        else{
            if (target>99){
            baltext.innerText = `${target.toFixed(1)} GOT`;
        }
        else{
                baltext.innerText = `${target.toFixed(2)} GOT`;

            }
        }
    }
    updatebalance();
});
}, 1);

const bigbox = document.getElementById("bigbox");
const account = bigbox.getAttribute("account");
if(account==="UNVERIFIED"){
    bigbox.style.display = "block";
let interval = setInterval(() => {
    const text = document.getElementById("time");
    const activatebtn = document.getElementById("activatebtn");
    const createdAt = text.getAttribute("createdAt");
    let timeremainms = 86400000 - (Date.now()-createdAt)
    if(timeremainms>0){
    let timeremainhr = Math.floor(timeremainms/3600000);
    timeremainms = timeremainms - (timeremainhr*3600000);
    let timeremainmin = Math.floor(timeremainms/60000);
    timeremainms = timeremainms - (timeremainmin*60000);
    let timeremainsec = Math.floor(timeremainms/1000);
    if(timeremainhr<10) timeremainhr = `0${timeremainhr}`;
    if(timeremainmin<10) timeremainmin = `0${timeremainmin}`;
    if(timeremainsec<10) timeremainsec = `0${timeremainsec}`;
    let timeremain = `${timeremainhr}:${timeremainmin}:${timeremainsec}`
    const textbox = document.getElementById("timebox");
    textbox.style.width="calc(100% - 16px)";
    let message = "to activate your account to work more with us.&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp";
    text.innerHTML = `Come back in <span style="color: green; font-weight: bold;">${timeremain}</span> ${message} Come back in <span style="color: green; font-weight: bold;">${timeremain}</span> ${message} Come back in <span style="color: green; font-weight: bold;">${timeremain}</span> ${message}`;
}
else{
    clearInterval(interval);
    text.innerHTML = `Please click the button to activate your account.&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPlease click the button to activate your account.&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspPlease click the button to activate your account.`
    activatebtn.style.display = "inline"

    }

}, 1000);
}
function activateaccount(){
    window.location.href = `https://getsokay.com/activate-account`;
}

var margin = 0;
setInterval(() => {
    const text = document.getElementById("time");
    if(margin<510){
    margin+=1;
    text.style.right = `${margin}px`;
    }
    else{
        margin = 0;
    }
}, 30);