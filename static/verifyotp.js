
const host = "https://getsokay.com";
var resend;
var valueresend;
function onSubmitOTP() {
  $.post(host + "/verifyotp",
    {
      otp: $("#otp").val()
    },
    function (data, status) {
      console.log(data, status);
      const errorbox = document.getElementById("errorbox");
      if (data == "Successfully verified") {
        errorbox.style.background = "#2d8640";
        errorbox.style.padding = "18px";
        $("#error").html(data);
        window.location.href = `${host}/dashboard`;
      }
      else {
        errorbox.style.background = "#d14343";
        errorbox.style.padding = "18px";
        $("#error").html(data);
        $("#otp").val("");
      }
      setTimeout(() => {
        errorbox.style.padding = "";
        $("#error").html("");
    }, 3000);
    });
};

function onresendOTP() {
  console.log(valueresend);
  resend = document.getElementById("resend");
  valueresend = resend.innerText;
  if (valueresend === "Resend") {
    $.get(host + "/resendotp",
      function (data, status) {
        console.log(data, status);
        const errorbox = document.getElementById("errorbox");
        if (data == "resent") {
        errorbox.style.background = "#2d8640";
        errorbox.style.padding = "18px";
        $("#error").html("Code Sent");
          var time = 59;
          let interval = setInterval(() => {
            resend.innerText = `${time}s`;
            if (time > 0) {
              time -= 1;
            }
            else {
              clearInterval(interval);
              resend.innerText = `Resend`;
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
}
