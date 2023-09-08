console.log("hello");
const host = "https://getsokay.com";
function onLogin() {
    $.post("/login",
        {
            username: $("#username").val(),
            password: $("#password").val()
        },
        function (data, status) {

            console.log(data, status);
            console.log(data == "Account Logged In");
            const errorbox = document.getElementById("errorbox");
            if (data == "Account Logged In") {
                errorbox.style.background= "#2d8640";
                errorbox.style.padding = "18px";
                $("#error").html(data);
                window.location.href = `${host}/dashboard`;
            }
            else if (data == "email unverified") {
                errorbox.style.background= "#2d8640";
                errorbox.style.padding = "18px";
                $("#error").html("Verify Email Address");
                window.location.href = `${host}/verify-otp`;
            }
            else {
                errorbox.style.background= "#d14343";
                errorbox.style.padding = "18px";
                $("#error").html(data);
                $("#email").val("");
                
            }
            setTimeout(() => {
                errorbox.style.padding = "0px";
                $("#error").html("");
            }, 3000);
        });
};


function onForgetPass(){
    window.location.href = `${host}/forgetpassword`;
}

  