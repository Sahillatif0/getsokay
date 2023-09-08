var method;
const form = document.getElementById("easypaisa-dep-form")
method = form.getAttribute("deposit_method");
let amount = document.getElementById("amount")
let GOTTRX;
let TRXmin;
$.get("/gettrx", function(data, status){
    GOTTRX = data.GOTprice;
    TRXmin=GOTTRX*20;
})
amount.addEventListener("input", (e) => {
    let amount = e.target.value.toLowerCase();
    const recieve = document.getElementById("recieve")
    const amountbox = document.getElementById("Amountbox")
    var minimum = 100;
    var GOTprice = 5;
    if (method == "tronlink") {
        minimum =   TRXmin;
        GOTprice = GOTTRX;
    }
    if (amount < minimum && amount) {
        amountbox.style.border = "2px solid red";
    }
    else if (!amount) {
        amountbox.style.border = "none";
    }
    else {
        amountbox.style.border = "2px solid green";
    }
    if(amount){
        recieve.textContent=`${(amount/GOTprice).toFixed(2)} GOT`;
    }
    else{
        recieve.textContent="";
    }
});
function onOk(){
    window.location.href = `https://getsokay.com/deposit`;
}
function onSubmitDepData() {
    $.post("/easypaisa-dep",
        {
            TrxID: $("#TrxID").val(),
            amount: $("#amount").val(),
            method: method
        },
        function (data, status) {
            const errorbox = document.getElementById("errorbox");
            var minimum = 100;
            if (method == "tronlink") {
                minimum = 7
            }
            console.log(data, status);
            console.log(data == "Transaction Added");
            if (data == "Transaction Added") {
                $("#confirmationPopup").css("display", "flex")
            }
            else if (data == "TrxID empty") {
                errorbox.style.background= "#d14343";
                errorbox.style.padding = "18px";
                $("#error").html("Transaction ID can't be empty");
                $("#TrxID").val("");

            }
            else if (data === "amount empty") {
                console.log("Amount can't be empty");
                errorbox.style.background= "#d14343";
                errorbox.style.padding = "18px";
                $("#error").html("Amount can't be empty");

            }
            else if (data === "less 100") {
                console.log("Amount can't be less than " + minimum);
                errorbox.style.background= "#d14343";
                errorbox.style.padding = "18px";
                $("#error").html("Amount can't be less than " + minimum);
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
