const host = "https://getsokay.com";
var resend;
var valueresend;
function onsendOTP() {
    console.log(valueresend);
    resend = document.getElementById("resend");
    valueresend = resend.innerText;
    if (valueresend === "Resend" || valueresend === "Send Code") {
      $.post(host + "/sendotp",
       {email: $("#email").val()}
      ,
        function (data, status) {
          console.log(data, status);
          const errorbox = document.getElementById("errorbox");
          if (data == "resent") {
          errorbox.style.background = "#2d8640";
          errorbox.style.padding = "18px";
          $("#error").html("Code Sent");
          var time = 59;
          let interval = setInterval(() => {
                resend.style.marginLeft = "44px"
                resend.innerText = `${time}s`;
                if (time > 0) {
                    time -= 1;
                }
                else {
                    clearInterval(interval);
                    resend.style.marginLeft = "10px"
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


  function onactivateAccount() {
    $.post(host + "/activate-account",
      {
        otp: $("#otp").val()
      },
      function (data, status) {
        console.log(data, status);
        const errorbox = document.getElementById("errorbox");
        if (data == "Successfully Verified") {
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