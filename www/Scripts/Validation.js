const { json } = require("body-parser");

function register() {
    var username = document.getElementById("login").value;
    var password = document.getElementById("password").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {

            if (xhttp.status == 200){
                alert('Account created! redirecting.')
            console.log('Account ' + username + ' registered')
            } else {
                console.error('Error:', xhttp.statusText);
            }
        }
    };

    var data = {
        "playerName": username,
        "playerPassword": password,
    }

    
    xhttp.open("POST", "/player/createPlayer", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function try2login() {
    var username = document.getElementById("login").value;
    var password = document.getElementById("password").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {

            if (xhttp.status == 200){
                alert('Welcome back ' + username + '! redirecting...')
                console.log('Account ' + username + ' online')
                // window.location.replace('/mainPage.html');
                
            } else {
                console.error('Error:', xhttp.statusText);
            }
        }
    };

    var data = {
        "playerName": username,
        "playerPassword": password,
    }


    xhttp.open("POST", "/login/login", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function redirect(){
    window.location.replace('/Login.html');
};

function exit(){
    window.location.href = "https://www.google.com"
};

