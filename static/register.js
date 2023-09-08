var phoneInput;
var country_code;
setTimeout(() => {
    function getIp(callback) {
        fetch('https://ipinfo.io/json?token=fee3f79f4e5ff8', { headers: { 'Accept': 'application/json' } })
            .then((resp) => resp.json())
            .catch(() => {
                return {
                    country: 'us',
                };
            })
            .then((resp) => callback(resp.country));
    }

    const phoneInputField = document.querySelector("#phone");
    phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "auto",
        geoIpLookup: getIp,
        utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
    country_code = phoneInput.getSelectedCountryData()["dialCode"]
}, 100);

const host = "https://getsokay.com";

function onSubmitData() {
    if (phoneInput.isValidNumber()) {
        $.post(host + "/registers",
            {
                username: $("#username").val(),
                name: $("#name").val(),
                email: $("#email").val(),
                phone: phoneInput.getNumber(),
                countrycode: country_code,
                password: $("#password").val(),
                confirmpassword: $("#confirmpassword").val(),
                referrerID: $("#referrerID").val()
            },
            function (data, status) {

                console.log(data, status);
                console.log(data == "Email Sent");
                const errorbox = document.getElementById("errorbox");
                if (data == "Email Sent") {
                    errorbox.style.background = "#2d8640";
                    errorbox.style.padding = "18px";
                    $("#error").html(data);
                    window.location.href = `${host}/verify-otp`;
                }
                else {
                    errorbox.style.background = "#d14343";
                    errorbox.style.padding = "18px";
                    $("#error").html(data);
                    $("#email").val("");

                }
                setTimeout(() => {
                    errorbox.style.padding = "";
                    $("#error").html("");
                }, 3000);
            });
    }
    else {
        errorbox.style.background = "#d14343";
        errorbox.style.padding = "18px";
        $("#error").html("Invalid phone number");
        $("#phone").val("");
        setTimeout(() => {
            errorbox.style.padding = "";
            $("#error").html("");
        }, 3000);
    }
};

