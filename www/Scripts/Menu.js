// const { json } = require("body-parser");

function joinMatch(matchID){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log(xhttp.status + " | " + xhttp.responseText)
        }
    };

    data = JSON.stringify({
        playermatch_match_id: matchID
    });

    xhttp.open("PUT", "/joinMatch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);
}

function creatematch(playerID){
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log(xhttp.responseText)

            if (xhttp.status == 200){  

            }
            else if (xhttp.status == 403)
            {
                document.location.href = "login.html";
            }
            else
                console.log(xhttp.responseText)
        }
    };

    xhttp.open("POST", "/creatematch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function func() {
    console.log('we are getting matches...'); 
    fetch('/matches')
        .then(response => {
            if (!response.ok) {
                throw new Error('bad response ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data); 
            const lobbyList = document.getElementById('lobby-list');
            lobbyList.innerHTML = '';  

            if (data.length === 0) {
                const listItem = document.createElement('li');
                listItem.textContent = 'No lobbie avalible';                           
                lobbyList.appendChild(listItem);
            } else {
                data.forEach(match => {
                    console.log('Processing match:', match); 
                    const listItem = document.createElement('li');

                    
                    const lobbyText = document.createElement('span');
                    lobbyText.textContent = `lobby ${match.match_id}`;
                    
                    
                    const joinButton = document.createElement('button');
                    joinButton.textContent = 'Join Lobby';
                    joinButton.classList.add('button_2');

                    joinButton.onclick = function() {
                        // Call the endpoint '/joinMatch' with the match_id (variable name: playermatch_match_id)
                        joinMatch(match.match_id);
                    };
                    
                    
                    
                    listItem.appendChild(lobbyText);
                    listItem.appendChild(joinButton);
                    lobbyList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            const lobbyList = document.getElementById('lobby-list');
            lobbyList.innerHTML = '';
            const listItem = document.createElement('li');
            listItem.textContent = 'Error fetching matches. Please try again later.';
            lobbyList.appendChild(listItem);
        });
}

function exit(){
    window.location.href = "https://www.google.com"
};

function playmusic(){
    var audio = document.getElementById('background-music');
    audio.play();
};

function pauseMusic() {
    var audio = document.getElementById('background-music');
    audio.pause();
}

function checkPlayerMatchState() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log(xhttp.status + " | " + xhttp.responseText)
            
            if (xhttp.status == 200){
                // Check again after 1 second.
                setTimeout(checkPlayerMatchState, 1000);
            }

            if (xhttp.status == 308){
                setTimeout(() => {
                    console.log("MATCH FOUND. REDIRECTING IN 3 SECONDS...")
                    document.location.href = "/Engine";
                },3000)
            }
        }
    };

    xhttp.open("GET", "/playerState/getPlayerMatchState", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}

function checkPlayerIsInMatch() {   
    console.log("Hsagfhusagusaghsaugsahugasuhgashu")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log(xhttp.status + " | " + xhttp.responseText)
            if (xhttp.status == 403) {
                document.location.href = "login.html";
            }
            if (xhttp.status == 308){  
                // Check if the match started or not.
                checkPlayerMatchState();
            }
        }
    };

    xhttp.open("GET", "/playerState/getPlayerMatch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send();
}
















