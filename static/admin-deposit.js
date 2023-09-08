const host = "https://getsokay.com/admin";
let histories;
$.get(host + "/getdeposit",
    function (data, status) {
        histories = data.deposithistory;
        histories.forEach(history=>{
            switch(history.status){
            case "PENDING":
                $("#btn"+history.depositID).css({"background": "#5681eb", "box-shadow": "#758c8f 2px 2px 2px 2px"});
                break;
            case "APPROVED":
                $("#btn"+history.depositID).css({"background": "#5beb56", "box-shadow": "#65a367 2px 2px 2px 2px"});
                break;
            case "REJECTED":
                $("#btn"+history.depositID).css({"background": "#d65c5c", "box-shadow": "#7b5259 2px 2px 2px 2px"});
                break;
            
        
        }
        })
    })


const searchinput = document.getElementById("search");
searchinput.addEventListener("input", (e) => {
    let inputvalue = e.target.value.toLowerCase();
    histories.forEach(history => {
        const historybox = document.getElementById(history.depositID);
        const isVisible = toString(history.depositID).includes(inputvalue) || history.username.toLowerCase().includes(inputvalue) || history.transaction_id.toLowerCase().includes(inputvalue) || history.email.toLowerCase().includes(inputvalue) || history.status.toLowerCase().includes(inputvalue) || history.amount.toLowerCase().includes(inputvalue) || history.method.includes(inputvalue);
        if (isVisible === true) {
            historybox.style.display = "flex";
        }
        else {
            historybox.style.display = "none";
        }

    });
});
function onok(){
    let from = $("#amountinput").val();
    let to = $("#amountinput2").val();
    from = from===""?0:from;
    to = to===""?1000:to;
    histories.forEach(history=>{parseFloat(history.amount)>parseFloat(from) && parseFloat(history.amount)<parseFloat(to)?history.validamount=true:history.validamount=false 
    console.log(history.validamount)})
    $("#amount").css("background", "#6ab6f0")
    $("#amountbtn").html(from+ " - "+ to);
    onamount()
    filter();
}
function onamount(){
    $("#amountFilterbtn").css("display")==="none"?$("#amountFilterbtn").css("display","flex"):$("#amountFilterbtn").css("display","none");
    $("#popupinput").css("display")==="none"?$("#popupinput").css("display","flex"):$("#popupinput").css("display","none");
    // document.getElementById("amountFilterbtn").style.display = "none";
    // document.getElementById("popupinput").style.display = "flex";
}
var datefrom = 0;
var dateto = 0;
const datefromInput = document.getElementById("datetimefrom");
datefromInput.addEventListener("input", (e) => {
    datefrom = Date.parse(e.target.value);
    filterByDate();
})
const datetoInput = document.getElementById("datetimeto");
datetoInput.addEventListener("input", (e) => {
    dateto = Date.parse(e.target.value);
    filterByDate();
})
function filterByDate(){
    histories.forEach(history=>{Date.parse(history.date)>datefrom && Date.parse(history.date)<dateto?history.validdate=true:history.validdate=false})
    filter();
}
let statusFilterlist = [];
let methodFilterlist = [];
function onfilter(value,type) {
    $("#"+value).toggleClass("selectedfilterBtn unselectedfilterBtn");
    let isMethod = type==="METHOD";
    let index = isMethod?methodFilterlist.indexOf(value):statusFilterlist.indexOf(value);
    if(index >-1){
        isMethod?methodFilterlist.splice(index, 1):statusFilterlist.splice(index, 1);
    }else{
        isMethod?methodFilterlist.push(value):statusFilterlist.push(value);
    }
    filter();
}
function filter() {
    console.log(statusFilterlist,methodFilterlist);
    let statusExist = statusFilterlist.length!=0;
    let methodExist = methodFilterlist.length!=0;
    let temphistories = histories;

    temphistories.forEach(history=>document.getElementById(history.depositID).style.display = "none");
    temphistories = statusExist?temphistories.filter(history=>statusFilterlist.includes(history.status.toLowerCase())):histories;
    temphistories = temphistories.filter(history=>history.validamount || history.validamount===undefined);
    console.log(temphistories);
    temphistories = temphistories.filter(history=>history.validdate || history.validdate===undefined);
    console.log(temphistories);
    temphistories = methodExist?temphistories.filter(history=>methodFilterlist.includes(history.method.toLowerCase())):temphistories;
    temphistories.forEach(history=>document.getElementById(history.depositID).style.display = "flex");
}