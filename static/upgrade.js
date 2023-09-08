let selectpkg = document.getElementById("selectpkg");
let pkgduration = document.getElementById("pkgduration");
let pkgprice = document.getElementById("pkgprice");
let reqprice = document.getElementById("reqprice");
let availbal = document.getElementById("availbalance");
let pkgdurationms;
let ms = 2592000000;
let ds = 86400000;
let lessbal = false;
setInterval(()=>{
    let availbalance = parseFloat(availbal.value);
    if(selectpkg.value==="STANDARD") {
    pkgprice.value = "20 GOT";
    if(pkgduration.value==="1 Month"){
        pkgdurationms = (1*ms)+ds;
        reqprice.value = "20 GOT";
    }
    else if(pkgduration.value==="2 Months"){
        pkgdurationms = (2*ms)+ds;
        reqprice.value = "39 GOT";
    }
    else if(pkgduration.value==="6 Months"){
        pkgdurationms = (6*ms)+ds;
        reqprice.value = "110 GOT";
    }
    else if(pkgduration.value==="1 Year"){
        pkgdurationms = (12*ms)+ds;
        reqprice.value = "200 GOT";
    }
}
else if(selectpkg.value==="PREMIUM") {
    pkgprice.value = "100 GOT";
    if(pkgduration.value==="1 Month"){
        pkgdurationms = (1*ms)+ds;
        reqprice.value = "100 GOT";
    }
    else if(pkgduration.value==="2 Months"){
        pkgdurationms = (2*ms)+ds;
        reqprice.value = "196 GOT";
    }
    else if(pkgduration.value==="6 Months"){
        pkgdurationms = (6*ms)+ds;
        reqprice.value = "650 GOT";
    }
    else if(pkgduration.value==="1 Year"){
        pkgdurationms = (12*ms)+ds;
        reqprice.value = "999 GOT";
    }
}
if(availbalance<(parseFloat(reqprice.value))){
    reqprice.style.color = "red";
    lessbal = true;
}
else{
    reqprice.style.color = "black";
    lessbal = false;
}
},1000);
async function updateUserData(){
    let User;
await $.get("/getavailbal",
function (data, status) {
User = data.User;
});
return User
}

async function changePage(){
    let User = await updateUserData();
    if (User.plan!="FREE") {
        $("#buypkg").html("Extend Package");
        $("#dur").html("Extend Duration");
        if(User.plan=="PREMIUM")
        {
            $("#selectpkg").html(`<option value="PREMIUM">PREMIUM</option>`);
        }
    }

}
changePage();
function confirmationDetail(){
    $("#pkgp").html($("#selectpkg").val());
    $("#pkgdurp").html($("#pkgduration").val());
    $("#availamop").html($("#availbalance").val());
    $("#totamop").html("-"+$("#reqprice").val());
}

function onBuyPkg(){
    $("#confirmationPopup").css("display","flex");
    confirmationDetail();
}
function onCancel(){
    $("#confirmationPopup").css("display","none");
}
async function onOk(){
    $("#statusmessage").css("display", "none");
    $("#popup").css("display", "flex");
    $("#confirmationPopup").css("display","none");
    let User = await updateUserData();
    $("#availbalance").val(`${User.availableBalance} GOT`);
    $("#seelectpkg").val(User.plan);
    changePage();

}
function showError(error){
    $(".checkmark").html(`<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check" fill="none" d="M13,13 L38,38"></path><path class="checkmark__check" fill="none" d="M38,13 L13,38"></path>`);
    $("#statusmessage").get(0).style.setProperty("--messcolor","#dd2900");
    $("#mess").html(error);
    $("#thankyou").html("Okay");
    $("#thankyou").css("background", "linear-gradient(45deg, #ef7171, #dd2900)");
}
function showSuccess(){
    $(".checkmark").html(`<circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>`);
    $("#statusmessage").get(0).style.setProperty("--messcolor","#00dda6");
    $("#mess").html("Your Account Has Been Upgraded Successfully");
    $("#thankyou").html("Thank You");
    $("#thankyou").css("background", "linear-gradient(45deg, #71ef81, #00dda6)");
}
function onConfirm(){
    $("#statusmessage").css("display", "flex");
    $("#popup").css("display", "none");
    const errorbox = document.getElementById("errorbox");
    if(lessbal===true){
        showError("You Don't Have Enough Balance");
    }
    else{
    $.post("/buypkg",
    {
      selectedpkg: $("#selectpkg").val(),
      pkgduration: pkgdurationms,
      availbalance: $("#availbalance").val(),
      reqprice: $("#reqprice").val(),
      action: $("#buypkg").html()
    },
    function (data, status) {
      if (data == "Successfully Purchased") {
        showSuccess();
        // window.location.href = `${host}/dashboard`;
      }
      else {
        errorbox.style.background = "#d14343";
        errorbox.style.padding = "18px";
        $("#error").html(data);
        $("#otp").val("");
      }
    });
}

setTimeout(() => {
  errorbox.style.padding = "";
  $("#error").html("");
}, 3000);
}
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
