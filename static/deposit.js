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
