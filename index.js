const express = require ('express');
const path = require('path');
const app = express();
const mysql = require("mysql2");
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require('./database');                                   //routes
const match = require('./API/match');
const player = require('./API/player');
const endTurn = require('./API/endTurn');
const getRandomCassettes = require('./API/getRandomCassettes');
const movement = require('./API/movement');
const useCassette = require('./API/useCassette');
const login = require('./API/login');

  
connection.connect((err) => {
    if (err){
        console.log("error to connect to the database: " + err);
        return;
    }
    console.log("Database connected");
});


app.use(session({
    secret: 'borsch',   //cokie secret
    resave: false,
    saveUninitialized: true,
    cookie: {
                maxAge: 6000000             
        }
  }))

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, 'www')));
app.use(express.json())

app.use('/match', match); 
app.use('/player', player); 
app.use('/endTurn', endTurn);
app.use('/getRandomCassettes', getRandomCassettes);
app.use('/movement', movement);
app.use('/useCassette', useCassette);
app.use('/login', login)

app.get("/tile_id_data", (req, res) => {
    // playerID = req.session.playerID
    var playerID = 1
    connection.execute('SELECT tile_id FROM playermatch WHERE player_id = ?', [playerID], (err,result) => {
        if (err) {
            console.error("Error getting tile_id", err);
            res.status(500).send("Error getting tile_id");
            return;
        } else {
            res.json(result[0])
        
    }
}); 
})

app.get("/getPlayerPositions", (req, res) => {
    playerID = req.session.playerID
    connection.execute('SELECT player_id, tile_id FROM playermatch', [], (err,result) => {
        if (err) {
            console.error("Error getting tile_id", err);
            res.status(500).send("Error getting tile_id");
            return;
        } else {
            var isPlayer1Local = playerID == result[0].player_id
            res.json({
                'player1Data': result[0],
                'player1Ownership': isPlayer1Local,
                'player2Data': result[1],
                'player2Ownership': !isPlayer1Local,
            })
        
    }
}); 
})

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'www/Register.html'));

}); 

app.get('/get_player_id', (res,req)  => {
    var playerID = req.session.playerID
    var match_id = req.body.match_id
    connection.execute('SELECT player_id FROM playermatch WHERE playermatch_match_id = ? and player_id = ?', [match_id,  playerID], (err,result) => {
        if (err) {
            console.error("Error getting player_id", err);
            res.status(500).send("Error getting player_id");
            return;
        } else {
            res.json(result[0])
        }
    

})
});





// app.post('/login', (req, res) => {
//     var playerName = req.body.playerName;
//     var playerPassword = req.body.playerPassword;

//     console.log("Username: " + playerName)
//     console.log("Password: " + playerPassword)

//     if (!playerName || !playerPassword){
//         res.status(400).send({
//             "error": "Missing password or login"
//         })
//         return;
//     }

//     // Checks if the login exists in the database.
//     function checkLogin(){
//         connection.execute('SELECT * FROM player WHERE player_name = ? AND player_password = ?',
//         [playerName, playerPassword],
//         function (err, results, fields) {
//             if (err) {
//                 res.status(500).send({
//                     "error": err
//                 });
//                 return;
//             }

//             if (results.length == 0){
//                 res.status(404).send({
//                     "error": "Invalid username or password 💩"
//                 });
//                 return;
//             }

//             LogPlayerIn(results[0].player_name, results[0].player_id);
//         });
//     }

//     // Logs the player in. We store the playerID and the username in the session.
//     function LogPlayerIn(playerName, playerID){
//         req.session.playerID = playerID;
//         req.session.username = playerName;
//         res.status(200).send({
//             "message": "Welcome back " + playerName + "!"
//         });
//     }

//     checkLogin();
// });




// function createAccount(request, response, playerName, playerPassword){
//     connection.execute('INSERT INTO player (player_name, player_password) VALUES (?,?)',
//         [playerName,playerPassword],
//         function (err, results, fields) {
//             if (err){
//                 response.send(err);
//             }else{
//                 response.send("Account created - " + playerName);
//             }
//         });
// }




// 

// app.put('/joinMatch', (request, response) =>  {
//     var playerID = request.body.playerID;
//     var matchID = request.body.matchID;

    
//     if (!playerID || !matchID){
//         response.send("Data is missing. 💩");
//         return;
//     }

    
//     connection.execute('SELECT * FROM player_match WHERE pm_match_id = ? AND pm_player2_id is null AND pm_player1_id != ?',
//     [matchID, playerID],
//     function (err, results, fields) {
//         if (err){
//             response.send(err);
//         }else{
            
//             if (results.length == 0){
//                 response.send("No match found with id " + matchID);
//             }else{
                
//                 connection.execute('UPDATE player_match SET pm_player2_id = ?',
//                 [playerID],
//                 function (err, results, fields) {
//                     if (err){
//                         response.send(err);
//                     }else{
//                         response.send("You joined match " + matchID + " 💩🦄");
//                     }
//                 });
//             }
//         }
//     });
// });


// app.get('/matches', (request, response) => {
//     connection.execute('SELECT * FROM all_matches',
//     [],
//     function (err, results, fields) {
//         if (err)
//         {
//             response.send(err);
//         }else{
//             response.send(results);
//         }
//     });
// });


// app.get('/matches/:id', (request, response) => {
//     var matchID = request.params.id;
//     connection.execute('SELECT * FROM all_matches WHERE match_id = ?',
//     [matchID],
//     function (err, results, fields) {
//         if (err)
//         {
//             response.send(err);
//         }else{
//             response.send(results);
//         }
//     });
// })


// app.get('/matches/:matchID/player', (request, response) => {
//     var matchID = request.params.matchID;

//     connection.execute('SELECT * FROM players_in_match WHERE match_id = ?',
//     [matchID],
//     function (err, results, fields) {
//         if (err)
//             response.send(err);
//         else if (results.length == 0)
//             response.send("No players found in the match."); 
//         else
//             response.send(results); // We are sending the array of players.
//     });
// });


// app.get('/matches/:matchID/player/:playerName', (request, response) => {
//     var matchID = request.params.matchID;
//     var playerName = request.params.playerName;

//     connection.execute('SELECT player_username, player_level FROM players_in_match WHERE match_id = ? AND player_username = ?',
//     [matchID, playerName],
//     function (err, results, fields) {
//         if (err)
//             response.send(err);
//         else if (results.length == 0)
//             response.send("No player found with that name in the match."); 
//         else
//             response.send(results[0]); 
//     });   
// });







app.post('/createMatch', (request, response) => {
    var playerID = request.session.playerID;
    if (!playerID){
        response.send("playerID is not set.");
        return;
    }

    // We are inserting into the table match the match_state_id and the playerID
    connection.execute('INSERT INTO gamematch VALUES (NULL, 0, 1, 1, 0);',
        [],
        function (err, results, fields) {
            if (err){
                response.send(err);
            }else{
                // We are getting the insertId after it was inserted into the table.
                // We can use this to insert to the intermediary table player_match
                var match_id = results.insertId;

                // Insert into the intermediary table player_match the playerID and the match_id.
                // Also, this could be done in different function to avoid callback hell. 👿
                connection.execute('INSERT INTO playermatch VALUES (?, ?, 29, 1, 0, 0, 0, 0, 0, 0, 0);',
                [playerID, match_id],
                function (err, results, fields) {
                    if (err){
                        response.send("Opsi dopsi. 💩");
                    }else{
                        // ❗ At the moment we are returning text but we could send a JSON with the playerID and match_id!!! 
                        response.send("Match created. player_id: " + playerID + " and match_id: " + match_id);
                    }
                });
            }
        });
});

// Endpoint for joining a match
app.put('/joinMatch', (request, response) =>  {
    var playerID = request.body.playerID;
    var match_id = request.body.match_id;

    // If playerID or matchID is not set, we send a message to the user
    if (!playerID || !match_id){
        response.send("Data is missing. 💩");
        return;
    }

    // We are checking if the match exists and if the player2_id is not set. Also, we are checking if the player1_id is different from the playerID since he can't join his own match.
    connection.execute("SELECT gm.match_id, pm.playermatch_match_id FROM gamematch gm JOIN playermatch pm ON gm.match_id = pm.playermatch_match_id WHERE gm.match_id = 2 AND pm.playermatch_match_id NOT IN ( SELECT playermatch_match_id FROM playermatch GROUP BY playermatch_match_id HAVING COUNT(playermatch_match_id) > 1 ('?')" 
    [match_id],
    function (err, results, fields) {
        if (err){
            response.send(err);
        }else{
            // If the results.length is 0 means that we don't have any match with the defined criteria.
            if (results.length == 0){
                response.send("No match found with id " + match_id);
            }else{
                // If we have a match, we update the player2_id with the playerID
                connection.execute('INSERT INTO playermatch VALUES (?, ?, 85, 1, 0, 0, 0, 0, 0, 0, 0);',
                [playerID, match_id],
                function (err, results, fields) {
                    if (err){
                        response.send(err);
                    }else{
                        // ❗Again, we could return a JSON with the playerID and matchID instead of text!
                        response.send("You joined match =" + match_id + " 💩🦄");
                    }
                });
            }
        }
    });
});

// Endpoint for getting all matches
app.get('/matches', (request, response) => {
    connection.execute('SELECT * FROM gamematch ',
    [],
    function (err, results, fields) {
        if (err)
        {
            response.send(err);
        }else{
            response.send(results);
        }
    });
});



app.get('/matches/:id', (request, response) => {
    var Player_match_id = request.params.id;
    connection.execute('SELECT * FROM gamematch WHERE match_id = ?',
    [Player_match_id],
    function (err, results, fields) {
        if (err)
        {
            response.send(err);
        }else{
            response.send(results);
        }
    });
})




app.listen(4444, () => {
    console.log('server-> http://localhost:4444')
});











//http://localhost:4444/ 

