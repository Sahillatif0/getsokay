var navbar = document.getElementById("navbar");
var sidebar = document.getElementById("sidebar-menu");
var li = document.querySelectorAll("#hamburger-menu li");
var maindiv = document.getElementById("maindiv");
var hamburgerMenu = document.getElementById("hamburger-menu");
var contentdiv = document.getElementById("contentdiv");
let image = document.getElementById("image");
let image2 = document.getElementById("image2");
let avatar = image.getAttribute('avatar');
function updateavatar(image){
image.style.background = `url(https://getsokay.com/static/images/avatar/${avatar}.png)`;
image.style.backgroundRepeat = "no-repeat";
image.style.backgroundPosition = "center";
image.style.backgroundSize = "cover";
}
updateavatar(image);
updateavatar(image2);
async function updateProgressBar(){
let User;
await $.get("/getavailbal",
function (data, status) {
User = data.User;
});
let planDuration = Math.round((Date.parse(User.planExpiry) - Date.parse(User.planAvailed))/86400000);
let remDuration = Math.round((Date.parse(User.planExpiry) - Date.now())/86400000);
console.log(remDuration);
let circleStartValue = planDuration,
circleEndValue = remDuration,
speed = 100;
let startpercent = 100,add = 100/planDuration;
let progress = setInterval(() => {
    startpercent = startpercent-add;
    console.log(startpercent);
    $("#plan-days").html(`${circleStartValue} Days`);
    $("#circle").css("background", `conic-gradient(#403e74 ${3.6*startpercent}deg, #fff 0deg)`)
    if(circleStartValue==circleEndValue || $("#profilepopup").css("display")==="none"){
        clearInterval(progress);
    }
    circleStartValue--;
}, speed);
}
image.addEventListener("click", element=>{
    showPopup();
})
function showPopup(){
    let prcnt = $("#profilepopup")
    if(prcnt.css("display")==="none"){prcnt.css("display","flex");updateProgressBar();}else{prcnt.css("display","none");}
}
var checkinbase = function (checked, device)
{
    if(checked === true && device === "web"){
        navbar.style.width = "calc(80vw - 21px)";
        sidebar.style.marginRight = "8px";
        let width = 0;
        let interval = setInterval(() => {
            if(width < 20)
        {   
            width+=10;
            sidebar.style.width = `${width}vw`;
        }
        else{
            li.forEach(li => {
                li.style.visibility = "visible";
            });
        
        clearInterval(interval);
    }
        }, 1);
    }
    else if(checked === false && device === "web"){
        navbar.style.width = "calc(100vw - 101px)";
        sidebar.style.width = "80px";
        sidebar.style.marginRight = "8px";
        li.forEach(li => {
            li.style.visibility = "hidden";
        });
    }
    else if(checked === true && device === "mob"){
        let side = sidebar;
        let sidbardiv = document.createElement("div");
        contentdiv.style.overflow = "hidden";
        contentdiv.style.width = "100vw";
        sidbardiv.id = "sidbardiv";
        let hbbg = document.createElement("div");
        hbbg.id = "hb-bg";
        side.prepend(hbbg);
        sidbardiv.prepend(side);
        maindiv.prepend(sidbardiv);
        
    }
    else if(checked === false && device === "mob"){
        var sidbardiv = document.getElementById("sidbardiv");
        sidbardiv.remove();
        hamburgerMenu.prepend(sidebar);
        contentdiv.style.overflowY = "auto";
        
    }
}

function onSubmenu(){
    const earnmenu = document.getElementById("earnmenu");
    const submenu = document.getElementById("submenu");
    var checkBox = document.getElementById("hamburger-input");
    var checkBoxmob = document.getElementById("hamburger");
    if((submenu.style.display==="none" || submenu.style.display==="") && (checkBox.checked===true || checkBoxmob.checked===true)){
        submenu.style.display="inline";
        earnmenu.style.height="50px";
        earnmenu.style.paddingBottom="176px";
        checkBox.checked=true;
        checkBox.setAttribute("checked", "checked");
        submenubar = true;
        
    }
    else{
        submenu.style.display="none";
        earnmenu.style.height="";
        earnmenu.style.paddingBottom="";
        submenubar = false;
    }
    return submenubar
}