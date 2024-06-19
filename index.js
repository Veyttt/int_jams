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
        console.log("now ur server crashed haha (error to connect to db)" + err);
        return;
    }
    console.log("Database was connected succesfuly"); 
});


app.use(session({
    secret: 'borsch',   //cokie secret
    resave: false,
    saveUninitialized: true,
    cookie: {
                maxAge: 6000000             
        }
  }));


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
    playerID = req.session.playerID
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

app.get("/playerState/getPlayerMatch", (req,res) => {
    console.log("Asking /playerState/getPlayerMatch");
    playerID = req.session.playerID;
    if (!playerID)
    {
        res.status(403).send("Not logged in");
        return;
    }

    connection.execute('SELECT * from playermatch WHERE player_id = ?',
        [playerID],
        (err, results) => {
            if (err){
                res.status(500).send(err);
                return;
            }

            if (results.length == 0){
                res.status(200).send("Not in a match");
                return;
            }

            req.session.matchID = results[0].playermatch_match_id;
            res.status(308).send("Player in a match. MatchID: " + results[0].playermatch_match_id)
        }
    )
    
})

app.get("/playerState/getPlayerMatchState", (req,res) => {
    console.log("Asking /playerState/getPlayerMatchState");
    playerID = req.session.playerID;
    if (!playerID)
    {
        res.status(403).send("Not logged in");
        return;
    }

    var matchID;

    function getPlayerMatch(){
        connection.execute('SELECT * from playermatch WHERE player_id = ?',
            [playerID],
            (err, results) => {
                if (err){
                    res.status(500).send(err);
                    return;
                }

                if (results.length == 0){
                    res.status(200).send("Not in a match");
                    return;
                }
    
                matchID = results[0].playermatch_match_id;
                returnMatchState();
            }
        )
        
    }

    function returnMatchState() {
        connection.execute('SELECT * from playermatch WHERE playermatch_match_id = ?',
            [matchID],
            (err, results) => {
                if (err){
                    res.status(500).send(err);
                    return;
                }
    
                if (results.length == 0){
                    res.status(403).send("Not in a match");
                    return;
                }

                if (results.length == 1){
                    res.status(200).send("Waiting for player 2");
                    return;
                }

                res.status(308).send("Match started");
            }
        )
    }

    getPlayerMatch();
})

app.get("/getPlayerPositions", (req, res) => {
    playerID = req.session.playerID
    matchID = req.session.matchID

    function getMatchID(){
        connection.execute('SELECT * from playermatch WHERE player_id = ?',
            [playerID],
            (err, results) => {
                if (err){
                    res.status(500).send(err);
                    return;
                }
    
                if (results.length == 0){
                    res.status(403).send("Not in a match");
                    return;
                }
    
                req.session.matchID = results[0].playermatch_match_id;
                matchID = results[0].playermatch_match_id;
                getPositions();
            }
        )
    }

    function getPositions(){
        connection.execute('SELECT player_id, tile_id FROM playermatch WHERE playermatch_match_id = ?'
            , [matchID]
            , (err,result) => {
            if (err) {
                console.error("Error getting tile_id", err);
                res.status(500).send("Error getting tile_id");
                return;
            }
    
            var isPlayer1Local = playerID == result[0].player_id
            res.status(200).send({
                'player1Data': result[0],
                'player1Ownership': isPlayer1Local,
                'player2Data': result[1],
                'player2Ownership': !isPlayer1Local,
            })
        }); 
    }

    if (!playerID){
        res.status(403).send("Not logged in - PlayerID missing");
        return;
    }

    if (!matchID)
        getMatchID();
    else
        getPositions();
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

app.post('/createMatch', (request, response) => {
    var player_id = request.session.playerID;

    if (!player_id){
        response.status(403).send("Not logged in");
        return;
    }

    // TODO: Validar se o jogador já está dentro da partida. Caso contrário nao avança.

    
    connection.execute('INSERT INTO gamematch (match_turn, match_state_id, match_map_id, match_name) VALUES (?,?,?,?)',
        [0, 1, 1, player_id],
        function (err, results, fields) {
            if (err){
                response.status(500).send(err);
            }else{
                
                console.log("gamematch created!");
                var match_id = results.insertId;
                
                connection.execute('INSERT INTO playermatch (player_id,playermatch_match_id,tile_id) VALUES (?, ?, 29)',
                [player_id, match_id],
                function (err, results, fields) {
                    if (err){
                        response.status(500).send(err);
                    }else{
                        console.log("playermatch created!")
                        request.session.matchID = match_id;
                        response.status(200).send("Match created. ID: " + match_id);
                    }
                });
            }
        });
});

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

app.put('/joinMatch', (request, response) =>  {
    var player_id = request.session.playerID;

    if (!player_id){
        response.status(403).send("Not logged in - PlayerID missing");
        return;
    }

    var playermatch_match_id = request.body.playermatch_match_id;

    if (!playermatch_match_id){
        response.status(400).send("Match ID missing");
        return;
    }
    
    connection.execute('SELECT * FROM playermatch WHERE playermatch_match_id = ? AND second_player = 0 ',
    [playermatch_match_id],
    function (err, results, fields) {
        if (err){
            response.send(err);
        }else{
            if (results.length == 0){
                response.send("No match found with id " + playermatch_match_id);
            }else{
                connection.execute('INSERT INTO playermatch VALUES (?, ?, 85, 1, 0, 0, 0, 0, 0, 0, 0, 1);',
                [player_id, playermatch_match_id],
                function (err, results, fields) {
                    if (err){
                        response.send(err);
                    }else{
                        response.send("You joined match " + playermatch_match_id + " 💩🦄");
                    }
                });
            }
        }
    });
});

app.get('/getboardmatch', (req,res) => {
    connection.execute("SELECT * from boardmatch",[],
        function(err,results){
            if (err){
                res.send(err);
            } else {
                res.send(results + 'data got with status 200');
            }
        }
    )

})

app.post('/updateWinstate', (req,res) => {
    console.log("update_w_state started")
     playerID = req.body.player_id
    if(!playerID){
        console.log('We are missing data')
    }
    connection.execute("UPDATE player SET player_wins = player_wins + 1, player_matches = player_matches + 1 WHERE player_id = ?",[playerID],
        function(err,result){
            if(err){
                console.error(err)
        }else{
            res.send('data updated')
        }}

    )

});

app.post('/updateMstate', (req,res) => {
    console.log("update_m_state started")
    playerID = req.session.playerID
    if(!playerID){
        console.log('We are missing data')
    }
    connection.execute("UPDATE player SET player_matches = player_matches + 1 WHERE player_id = ?",[playerID],
        function(err,result){
            if(err){
                console.error(err)
        }else{
            res.send('data updated')
        }}

    )
});

app.post('/winstateUpdate', async (req, res) => {
    const state  = req.body.state
    const playerId = req.body.player_id;
  
    if (!playerId) {
      return res.status(400).send('Player ID not found in cookies');
    }
  
    let updateQuery;
    if (state === 1) {
      updateQuery = `UPDATE player SET player_wins = player_wins + 1, player_matches = player_matches + 1 WHERE player_id = ?`;
    } else if (state === 2) {
      updateQuery = `UPDATE player SET player_matches = player_matches + 1 WHERE player_id = ?`;
    } else {
      return res.status(400).send('Invalid value');
    }
  
    try {
      await connection.execute(updateQuery, [playerId]);
      res.send('Player updated successfully');
    } catch (err) {
      console.error('Error updating player:', err);
      res.status(500).send('Database error');
    }
  });

app.listen(4444, () => {
    console.log('server-> http://localhost:4444/')
});

//easter egg. Hey nelio ;)
//it was hard semester, but it is what it is. Thank you and Cesar for helping us  11.06.2024  1:35 

