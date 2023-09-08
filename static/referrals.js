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

function oncopyLink(){
    setTimeout(() => {
        const copybtn = document.getElementById("copybtn");
        const referral_link = document.getElementById("referral-link-txt");
        navigator.clipboard.writeText(referral_link.textContent);
        console.log(copybtn.innerHTML);
        copybtn.innerHTML=`<i class="fa-solid fa-clipboard-check" aria-hidden="true"></i>`
        setTimeout(() => {
            copybtn.innerHTML=`<i class="fa fa-clone" aria-hidden="true"></i>`
            
        }, 10000);
        
    }, 1000);    

}
function oncopyCode(){
    setTimeout(() => {
        const copybtn = document.getElementById("copybtnid");
        const referral_code = document.getElementById("referral-code-txt");
        navigator.clipboard.writeText(referral_code.textContent);
        console.log(copybtn.innerHTML);
        copybtn.innerHTML=`<i class="fa-solid fa-clipboard-check" id="codecopy" aria-hidden="true"></i>`
        setTimeout(() => {
            copybtn.innerHTML=`<i class="fa fa-clone" id="codecopy" aria-hidden="true"></i>`
            
        }, 10000);
        
    }, 1000);    

}
