let activepage = window.location.href;
let loginpage = "https://getsokay.com/Login";
let homepage = "https://getsokay.com/";
let registerpage = "https://getsokay.com/Register";
let contactpage = "https://getsokay.com/ContactUs";

function activebtn() {
if (activepage == loginpage){
  let pg = document.getElementById("btn2");
  pg.classList.add('active')
}
else if (activepage == homepage){
  let pg = document.getElementById("btn1");
  pg.classList.add('active')
}
if (activepage == registerpage){
  let pg = document.getElementById("btn3");
  pg.classList.add('active')
}
if (activepage == contactpage){
  let pg = document.getElementById("btn4");
  pg.classList.add('active')
}
}

setTimeout(activebtn, 1000);

function onCheckedMob(){
  const navbar = document.getElementById("navbar");
  const checkbox = document.getElementById("hamburger");
  const formbox = document.getElementById("box");
  if(checkbox.checked==true){
    navbar.style.display = "flex";
    box.style.top = "300px";
    
  }
  else{
      navbar.style.display = "none";
      box.style.top = "85px";
  }
}

















// function activebtn() {
//   var clicked = "";
//   var btnContainer = document.getElementById('ul');
//   var btns = btnContainer.getElementsByClassName("btn");
//   // Loop through the buttons and add the active class to the current/clicked button
//   console.log(btns)
//   for (var i = 0; i < btns.length; i++) {
//   btns[i].addEventListener("click", function() {
//     var current = document.getElementsByClassName("active");
//     clicked = this
//     // console.log(current)
//     console.log(clicked)

//     // If there's no active class
//     if (current.length > 0) {
//       current[0].className = current[0].className.replace(" active", "");
//       console.log("Working.........");
//     }

//     // Add the active class to the current/clicked button
//     this.addClass = "active";
//     console.log(this.className);
//   });
//   }
// }

// setTimeout(activebtn, 1000);
