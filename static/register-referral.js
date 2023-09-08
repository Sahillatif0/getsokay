let page = window.location.href;
if(page==="https://getsokay.com/Register" || page==="https://getsokay.com/register" )
{
console.log("ryy");
}
else{
    setTimeout(() => {
        const referrerIDfield = document.getElementById("referrerID");
        referrerIDfield.value = referrerIDhidden.textContent;
        referrerIDfield.setAttribute("readonly", "readonly");
        
    }, 1000);
}