var navbar = document.getElementById("navbar");
var sidebar = document.getElementById("sidebar-menu");
var li = document.querySelectorAll("#hamburger-menu li");
var maindiv = document.getElementById("maindiv");
var hamburgerMenu = document.getElementById("hamburger-menu");
var contentdiv = document.getElementById("contentdiv");
var checkinbase = function (checked, device)
{
    if(checked === true && device === "desk"){
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
    else if(checked === false && device === "desk"){
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
        
    }
    else{
        submenu.style.display="none";
        earnmenu.style.height="";
        earnmenu.style.paddingBottom="";
    }
}
function onCheckedDesk(){
    let submenubar = $("#submenu").css("display");
    document.getElementById("hamburger-input").checked===false && submenubar==="none"?checkinbase(false, "desk"):checkinbase(true, "desk");     
}
function onCheckedMob(){
    document.getElementById("hamburger").checked===true?checkinbase(true, "mob"):checkinbase(false, "mob");     
}