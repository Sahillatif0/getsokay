var cpcprice;
var totalprice;

const host = "https://getsokay.com";
function onCreateAd() {
    $.post(host + "/createads",
        {
            ad_Name: $("#adname").val(),
            description: $("#description").val(),
            url : $("#url").val(),
            clickasked: $("#clicks").val(),
            duration: $("#duration").val(),
            cpc: cpcprice,
            totalcharges: totalprice
        },
        function (data, status) {

            console.log(data, status);
            console.log(data == "Account Logged In");
            const errorbox = document.getElementById("errorbox");
            if (data == "Ad Added") {
                errorbox.style.background= "#2d8640";
                errorbox.style.padding = "18px";
                $("#error").html(data);
                window.location.href = `${host}/yourads`;
            }
            else {
                errorbox.style.background= "#d14343";
                errorbox.style.padding = "18px";
                $("#error").html(data);
                $("#email").val("");
                
            }
            setTimeout(() => {
                errorbox.style.padding = "0px";
                $("#error").html("");
            }, 3000);
        });
};

setTimeout(() => {
    const cpc = document.getElementById("cpcp");
const total = document.getElementById("totalp");
const clicks = document.getElementById("clicks");
const duration = document.getElementById("duration");
setInterval(() => {
    if(duration.value==="10"){
        cpcprice = 0.05;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }
    else if(duration.value==="15"){
        cpcprice = 0.07;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }
    else if(duration.value==="20"){
        cpcprice = 0.09;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }
    else if(duration.value==="30"){
        cpcprice = 0.12;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }
    else if(duration.value==="45"){
        cpcprice = 0.16;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }
    else if(duration.value==="60"){
        cpcprice = 0.21;
        totalprice = (cpcprice*clicks.value).toFixed(2);
    }

    total.innerText = `Total Price: ${totalprice} GOT`;
    cpc.innerText = `CPC: ${cpcprice} GOT`;

}, 2000);
}, 3000);
