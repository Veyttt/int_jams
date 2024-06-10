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

app.post('/createMatch', (request, response) => {
    var player_id = request.body.player_id;
    if (!player_id){
        response.send("player_id is not set.");
        return;
    }

    
    connection.execute('INSERT INTO gamematch VALUES (NULL, 0, 1, 1, 0);',
        [],
        function (err, results, fields) {
            if (err){
                response.send(err);
            }else{
                
                var match_id = results.insertId;

                
                connection.execute('INSERT INTO playermatch (player_id,playermatch_match_id,tile_id) VALUES (?, ?, 29);',
                [player_id, match_id],
                function (err, results, fields) {
                    if (err){
                        response.send("Opsi dopsi. 💩");
                    }else{
                    
                        response.send("Match created. player_id: " + player_id + " and match_id: " + match_id);
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
    var player_id = request.session.player_id;
    var playermatch_match_id = request.body.playermatch_match_id;

   
    if (!player_id || !playermatch_match_id){
        response.send("Data is missing. 💩");
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

app.post('/updateWinstate', (req,res) => )




app.listen(4444, () => {
    console.log('server-> http://localhost:4444/')
});











//http://localhost:4444/ 

