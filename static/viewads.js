const socket = io("https://getsokay.com");
const message = document.getElementById("error");
const username = message.getAttribute("username");
socket.emit("socket-type", "main", username);
const messagebox = document.getElementById("errorbox");
socket.on("viewer-time", (time, ad_id) => {
    const timer = document.getElementById(ad_id);
    console.log(time);
    timer.innerText = `${time} sec`;
});
socket.on("message", (message, ad_id) => {
    const timer = document.getElementById(ad_id);
    timer.innerText = message;
});
socket.on("ad_done", (ad_id) => {
    const reward = document.getElementById(`reward${ad_id}`);
    const description = document.getElementById(`description${ad_id}`);
    const views = document.getElementById(`views${ad_id}`);
    console.log(`Succesfully Credited ${reward.innerText}`);
    messagebox.style.background = "#2d8640";
    messagebox.style.padding = "18px";
    message.innerText = `Succesfully Credited ${reward.innerText}`;
    description.classList.add("watched");
    reward.classList.add("watched");
    views.classList.add("watched");
    setTimeout(()=>{
        messagebox.style.padding = "";
        message.innerText = "";
    }, 3000)
});

