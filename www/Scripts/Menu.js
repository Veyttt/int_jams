// const { json } = require("body-parser");


function creatematch(playerID){
    

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


















