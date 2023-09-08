const host = "https://getsokay.com";

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


const profilebox = document.getElementById("profile-data");
const Avatars = document.getElementById("Avatars");
const SettingPage = document.getElementById("SettingPage");
const image = document.getElementById("image");
const avatars = document.querySelectorAll(".avatar");
let currentavatar = profilebox.getAttribute("avatar");
let selected = "";
SettingPage.style.display="flex";
Avatars.style.display="none";
function changeavatar(){
    SettingPage.style.display="none";
    Avatars.style.display="flex";
    loadavatarpage();
}
function showavatar(avatar){
    image.style.background = `url(static/images/avatar/${avatar}.png)`;
    image.style.backgroundRepeat = "no-repeat";
    image.style.backgroundPosition = "center";
    image.style.backgroundSize = "cover";
}
showavatar(currentavatar);
function loadavatarpage(){
let i = 0;
avatars.forEach(avatar => {
    avatar.style.background = `url(static/images/avatar/${i}.png)`;
    avatar.style.backgroundRepeat = "no-repeat";
    avatar.style.backgroundPosition = "center";
    avatar.style.backgroundSize = "cover";
    i++;
    if(avatar.id==selected){
        avatar.style.border = "4px solid green";
    }
    else if(selected=="" && avatar.id==currentavatar){
        avatar.style.border = "4px solid green";
    }
});

const avatar0 = document.getElementById("0");
const avatar1 = document.getElementById("1");
const avatar2 = document.getElementById("2");
const avatar3 = document.getElementById("3");
const avatar4 = document.getElementById("4");
const avatar5 = document.getElementById("5");
const avatar6 = document.getElementById("6");
const avatar7 = document.getElementById("7");
const avatar8 = document.getElementById("8");
const avatar9 = document.getElementById("9");
const avatar10 = document.getElementById("10");

let selection = function sel(avatar){
    selected = (avatar.id);
        avatars.forEach(element => {
            element.style.border = "2px solid black";
        });
        avatar.style.border = "4px solid green";
};
avatar0.addEventListener("click", function(){selection(avatar0);})
avatar1.addEventListener("click", function(){selection(avatar1);});
avatar2.addEventListener("click", function(){selection(avatar2);});
avatar3.addEventListener("click", function(){selection(avatar3);});
avatar4.addEventListener("click", function(){selection(avatar4);});
avatar5.addEventListener("click", function(){selection(avatar5);});
avatar6.addEventListener("click", function(){selection(avatar6);});
avatar7.addEventListener("click", function(){selection(avatar7);});
avatar8.addEventListener("click", function(){selection(avatar8);});
avatar9.addEventListener("click", function(){selection(avatar9);});
avatar10.addEventListener("click", function(){selection(avatar10);});

}
function onSelect(){
    avatars.forEach(element => {
        element.style.border = "2px solid black";
    });
    showavatar(selected);
    SettingPage.style.display="flex";
    Avatars.style.display="none";
}
function onCancel(){
    avatars.forEach(element => {
        element.style.border = "2px solid black";
    });
    if(selected==""){
    showavatar(currentavatar);}
    else{showavatar(selected);}
    SettingPage.style.display="flex";
    Avatars.style.display="none";
}


const name_i = document.getElementById("name-i");
const email_i = document.getElementById("email-i");
const name = document.getElementById("name-field");
const email = document.getElementById("email-field");
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
name_i.addEventListener("click", function(){remreadonly(name, name_i);})
email_i.addEventListener("click", function(){remreadonly(email, email_i);})
function onSave(){
    $.post(host+"/save-profile", 
    {
        avatar: selected,
        name: $("#name-field").val(),
        email: $("#email-field").val()
    }, function (data, status) {
        if(data==="successful set"){
            SettingPage.style.display="flex";
            Avatars.style.display="none";
        }
        console.log(data);
    })
}