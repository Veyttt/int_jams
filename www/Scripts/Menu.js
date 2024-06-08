const { json } = require("body-parser");


function creatematch(){

    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log('Match created succesfully (200)');
        }
    };

    var data = {
        "playerID": playerID
    }


    xhttp.open("POST", "/creatematch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}


// function getCookie(name) {
//     let value = "; " + document.cookie;
//     let parts = value.split("; " + name + "=");
//     if (parts.length === 2) return parts.pop().split(";").shift();
// }

// function sendPlayerID() {
//     let playerID = getCookie('playerID');
//     if (playerID) {
//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", "/creatematch", true);
//         xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        
//         xhr.onreadystatechange = function() {
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 console.log('Response received:', xhr.responseText);
//             }
//         };

//         let data = JSON.stringify({ playerID: playerID });
//         xhr.send(data);
//     } else {
//         console.error('playerID cookie not found');
//     }
// }

// document.addEventListener("DOMContentLoaded", function() {
//     sendPlayerID();
// });


