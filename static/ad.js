const socket = io("https://getsokay.com")
const timer = document.getElementById("duration");
const ad_id = timer.getAttribute("ad_id");
const url = timer.getAttribute("url");
const username = timer.getAttribute("username");
socket.emit("click", username);
socket.emit("socket-type", "ad", username);
var time = timer.innerText;
var already = false;
console.log(socket);
socket.on("already", (alr)=>{
    console.log("Hi i am workiihg");
    already = alr;
});
let interval = setInterval(() => {
    if(time>0 && already===false){
    time -=  1;
    timer.innerText = `${time} sec`;
    socket.emit("timer", time, ad_id, username);
    }
    else if(time===0 && already===false){
        clearInterval(interval);
        window.location.href = url;
    }
    else if(already===true){
        timer.innerText = `AD already running on other page`;
    }
}, 1000);