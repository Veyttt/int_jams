// const { response } = require("express");

var player_1_tileID=1
var player_2_tileID=2

function cleanBoard(){
    console.log("Updating board...");

    for (i = 1; i < 26; i++) {
        var tile = document.getElementById(i);
        tile.innerText = '';
    }

}

function getPlayerPosition(playerID){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            var tile = document.getElementById(jsonData);
            if (tile) {
                tile.innerText = 'Player';
            }
        }
    };
    xhttp.open("GET", "/tile_id_data/" + playerID, true);
    xhttp.send();
}

function move(direction) {
    var playerID = document.getElementById("playerID").value;
    if (!playerID)
        {
            console.log("Define the playerID in the input field!");
            return;
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText)
        if (this.readyState == 4 && this.status == 200) {
                cleanBoard();
                getPlayerPosition(1);
        }
    };

    var player_new_tile = player_1_tileID + 1;
    var data = {
        "player_id": playerID,
        "move": direction,
        };
    var jsonData = JSON.stringify(data);
    xhttp.open("POST", "/movement2");
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log(jsonData);
    xhttp.send(jsonData);
}


function EndTurn() {
    var playerID = document.getElementById("playerID").value;
    if (!playerID)
        {
            console.log("Define the playerID in the input field!");
            return;
        }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log("Request successful");
            } else {
                console.error("Request failed with status: " + this.responseText);
            }
        }
    };

    xhttp.open("put", "/endturn/endturn", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = {
        "match_id": 1,
        "player_id": playerID
    };
    var jsonData = JSON.stringify(data);
    console.log("jsonData");
    xhttp.send(jsonData); 
}
            

function updatePlayerPosition(playerID, direction) {
    if (!playerID) {
        console.log("Define the playerID in the input field!");
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                console.log('Player position updated successfully.');
            } else {
                console.log('Error updating player position:', this.responseText);
            }
        }
    };

    var data = {
        "player_id": playerID,
        "move": direction,
    };
    var jsonData = JSON.stringify(data);

    xhttp.open("POST", "/movement/movement");
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log("Sending request:", jsonData);
    xhttp.send(jsonData);
}

            
            



function getID()      {
    var playerID = document.getElementById('playerID').value; 
    var data = { "player_id": playerID };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("ID successfully sent!");
        }
    };
    xhttp.open("POST", "/movement2", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data)); 
       
};


cleanBoard();
getPlayerPosition(1);







    
  


