const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const playersFinder = require("./utils/playersGameFinder")

//db connection
mongoose
    .connect("mongodb://localhost/db", {useNewUrlParser: true})
    .then(() => {
        console.log("Connected to mongoDB");
    })
    .catch((e) => {
        console.log("Error while connecting DB");
        console.log(e);
    });

//app declaration
const app = express();

//Body Parser
const urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//routing definition
const router = express.Router();
app.use("", router);
require(__dirname + "/controllers/boardController")(router);

//Définition and listening port setup
const http = require('http').createServer(app);
const port = 8000;
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
http.listen(port, () => console.log(`Listening on port ${port}`));

//socketIO
let playersPerGameId = {};
io.on('connection', (socket) => {

    socket.on('disconnect', () => {
        console.log(socket.id + " disconnected.")
        playersFinder.handlePlayerDisconnection(playersPerGameId, socket.id)
    });

    //START AND UPDATE GAME VALUE WITH AN ID
    socket.on('gameStartId', (gameId, callback) => {
        let callBackValue;
        if (!playersPerGameId[gameId]) {
            playersPerGameId[gameId] = [];
        }

        if (!playersFinder.isPlayerPresent(gameId, playersPerGameId, "white")) {
            callBackValue = "white";
        } else if (!playersFinder.isPlayerPresent(gameId, playersPerGameId, "black")) {
            callBackValue = "black";
        } else if (playersFinder.isPlayerPresent(gameId, playersPerGameId, "white") && playersFinder.isPlayerPresent(gameId, playersPerGameId, "black")) {
            callBackValue = "TOO_MANY_PLAYERS";
        }
        playersPerGameId[gameId].push([callBackValue, socket.id]);
        callback({
            status: callBackValue
        });

        if (playersFinder.isSocketEligibleForGame(gameId, playersPerGameId, socket.id)) {
            console.log(socket.id + " joined game " + gameId + ".");
            socket.join("game_" + gameId)
        }

        socket.on("game_" + gameId, (gameData) => {
            socket.to("game_" + gameId).emit("gameData", gameData);
        });

    });

});
