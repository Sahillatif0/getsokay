const host = "https://getsokay.com";
var useremail;
function onSendCode() {
  resend = document.getElementById("check");
  valueresend = resend.innerText;
  if (valueresend === "Send Code" || valueresend === "Resend") {
    const errorbox = document.getElementById("errorbox");
    errorbox.style.background = "#2d8640";
    errorbox.style.padding = "18px";
    $("#error").html("Requesting....");
    $.post(host + "/forgetpassword",
      {
        email: $("#email").val()
      },
      function (data, status) {
        console.log(data, status);
        if (data == "email sent") {
          useremail = $("#email").val();
          errorbox.style.background = "#2d8640";
          errorbox.style.padding = "18px";
          $("#error").html("Code Sent");
          // window.location.href = `${host}/dashboard`;
          var time = 59;
          let interval = setInterval(() => {
            check.style.marginLeft = "15px";
            check.innerText = `${time}s`;
            if (time > 0) {
              time -= 1;
            }
            else {
              clearInterval(interval);
              check.style.marginLeft = "0px";
              check.innerText = `Resend`;
            }
          }, 1000);
          $("#otp").val("");
        }
        else {
          errorbox.style.background= "#d14343";
          errorbox.style.padding = "18px";
          $("#error").html(data);
          $("#otp").val("");
        }
        setTimeout(() => {
          errorbox.style.padding = "";
          $("#error").html("");
      }, 3000);
      });
  }
  console.log(resend.innerText);
}

function onGetPass() {
  $.post(host + "/checkcode",
    {
      email: useremail,
      otp: $("#otp").val()
    },
    function (data, status) {
      console.log(data, status);
      const errorbox = document.getElementById("errorbox");
      if (data.message == "code verified") {
        errorbox.style.background = "#2d8640";
        errorbox.style.padding = "18px";
        $("#error").html("Code Verified");
        window.location.href = `${host}/setnewpassword?hash=${data.hash}`;
      }
      else {
        errorbox.style.background= "#d14343";
        errorbox.style.padding = "18px";
        $("#error").html("*" + data);
        $("#otp").val("");
      }
      setTimeout(() => {
        errorbox.style.padding = "";
        $("#error").html("");
    }, 3000);
    });
}
