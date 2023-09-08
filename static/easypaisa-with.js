const host = "https://getsokay.com";
var method;
setTimeout(() => {
    const form = document.getElementById("easypaisa-dep-form");
    method = form.getAttribute("deposit_method");
}, 1000);
setInterval(() => {
    const typeamount = document.getElementById("amount");
    const confirm = document.getElementById("recieve");
    const amountbox = document.getElementById("Amountbox");
    const minimump = document.getElementById("minimum");
    var minimum = +minimump.getAttribute("minimum");
    var GOTprice = 5;
    var currency = "PKR";
    if (method == "tronlink") {
        GOTprice = 0.33;
        currency = "TRX";
    }
    if (typeamount.value < minimum && typeamount.value) {
        amountbox.style.border = "2px solid red";
    }
    else if (!typeamount.value) {
        amountbox.style.border = "none";
    }
    else {
        amountbox.style.border = "2px solid green";
    }
    if (typeamount.value) {
        confirm.textContent = `${((typeamount.value - ((typeamount.value / 100) * 5)) * GOTprice).toFixed(2)} ${currency}`;
    }
    else {
        confirm.textContent = "";
    }
}, 1000);
function onOk(){
    window.location.href = `${host}/withdrawl`;
}
function onSubmitWithData() {
    $.post(host + "/easypaisa-with",
        {
            EPname: $("#EPname").val(),
            EPnumber: $("#EPnumber").val(),
            amount: $("#amount").val(),
            method: method
        },
        function (data, status) {
            const errorbox = document.getElementById("errorbox");
            console.log(data, status);
            console.log(data == "Transaction Added");
            const minimump = document.getElementById("minimum");
            var minimum = +minimump.getAttribute("minimum");
            errorbox.style.background= "#d14343";
            errorbox.style.padding = "18px";
            if (data == "Transaction Added") {
                $("#confirmationPopup").css("display", "flex")
            }
            else if (data == "EPname empty" && method!=="Tronlink") {
                $("#error").html("Account Name can't be empty");

            }
            else if (data == "EPnumber empty") {
                $("#error").html("Account Number can't be empty");

            }
            else if (data === "amount empty") {
                $("#error").html("Amount can't be empty");

            }
            else if (data === "less minimum") {
                console.log("Amount can't be less than " + minimum);
                $("#error").html(`Minimum Withdrawl amount is ${minimum} GOT`);
                $("#amount").val("");

            }
            else if (data == "Not Enough") {
                const amountbox = document.getElementById("Amountbox");
                amountbox.style.border = "2px solid red";
                $("#error").html("Not Enough Balance Available");
                $("#amount").val("");
            }
            setTimeout(() => {
                errorbox.style.padding = "0px";
                $("#error").html("");
            }, 2000);
        });
};

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