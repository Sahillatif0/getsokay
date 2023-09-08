const host = "https://getsokay.com";
function onsendmessage(id){
        $.post(host + "/admin/sendmessage",
            {
                userID: id,
                title: $("#title").val(),
                message: $("#message").val()
            },
            function (data, status) {

                console.log(data, status);
                const errorbox = document.getElementById("errorbox");
                if (data == "Message Sent") {
                    errorbox.style.background = "#2d8640";
                    errorbox.style.padding = "18px";
                    $("#error").html(data);
                    //window.location.href = `${host}/verify-otp`;
                }
                else {
                    errorbox.style.background = "#d14343";
                    errorbox.style.padding = "18px";
                    $("#error").html(data);
                    

                }
                setTimeout(() => {
                    errorbox.style.padding = "";
                    $("#error").html("");
                }, 3000);
                $("#title").val("");
                $("#message").val("");
            });
    console.log("Message sent");
}
function onCancel(id){
    console.log("Back sent");
    window.location.href = host + "/admin/users";
}
