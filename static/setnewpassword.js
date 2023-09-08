const host = "https://getsokay.com";
function onSavePass(){
    $.post(host+"/setnewpassword",
    {
        newpassword: $("#password").val(),
        newconfirmpassword: $("#confirmpassword").val()
    },
      function(data,status){
          console.log(data,status);
          const errorbox = document.getElementById("errorbox");
          if (data == "password set"){
            errorbox.style.background= "#2d8640";
            errorbox.style.padding = "18px";
            $("#error").html(data);
            window.location.href = `${host}/login`;
        }
        else{
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
  