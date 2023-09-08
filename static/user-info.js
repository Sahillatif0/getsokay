const host = "https://getsokay.com/admin";
let users;
$.get(host + "/users-info",
    function (data, status) {
        users = data.users;
    })
function onedituser(userID) {
    window.location.href = host + "/edit?user=" + userID;
}
function onviewuser(userID) {
    window.location.href = host + "/view?user=" + userID;
}
function onmessageuser(userID) {
    window.location.href = host + "/message?user=" + userID;
}
const searchinput = document.getElementById("search");
searchinput.addEventListener("input", (e) => {
    let inputvalue = e.target.value.toLowerCase();
    users.forEach(user => {
        const userbox = document.getElementById(user.userID);
        const isVisible = toString(user.userID).includes(inputvalue) || user.username.toLowerCase().includes(inputvalue) || user.name.toLowerCase().includes(inputvalue) || user.email.toLowerCase().includes(inputvalue) || user.emailStatus.toLowerCase().includes(inputvalue) || user.phoneStatus.toLowerCase().includes(inputvalue) || user.account.toLowerCase().includes(inputvalue) || user.availableBalance.includes(inputvalue) || user.depositedBalance.includes(inputvalue) || user.withdrawnBalance.includes(inputvalue) || toString(user.referralID).includes(inputvalue) || toString(user.referrerID).includes(inputvalue) || toString(user.referralCount).includes(inputvalue) || user.plan.toLowerCase().includes(inputvalue);
        if (isVisible === true) {
            userbox.style.display = "flex";
        }
        else {
            userbox.style.display = "none";
        }

    });
})