const { json } = require("body-parser");


function creatematch(playerID){
    

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log('Match created succesfully (200) match_id=' + match_id);
        }
    };

    var data = {
        "playerID": playerID
    }


    xhttp.open("POST", "/creatematch", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(data));
}














function getMatches (){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            console.log('Matches were displayed succesful (200)');
        }
    };
    var data = JSON.parse(this.responseText);


    xhttp.open("GET", "/matches", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(data);

};

// async function currentMatches() {
//     try {
//         const response = await fetch('/matches');
//         const data = await response.json();
        
//         // Assuming the response has a property 'message'
//         const newData = data.message;

//         // Get the element by its ID
//         const textElement = document.getElementById("dynamicText");

//         // Set the new text content
//         textElement.textContent = newData;



//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }






