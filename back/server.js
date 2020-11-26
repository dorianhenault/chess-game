const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

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
io.on('connection', (socket) => {

    //todo handle client disconnect
    /*socket.on('disconnect', () => {
        console.log('user disconnected');
    });*/

    socket.on('gameStartId', (gameId) => {
        console.log(gameId + " Joined");
        socket.join("game_" + gameId)
        socket.on("game_" + gameId, (gameData) => {
            console.log(gameId)
            console.log(gameData.player)
            console.log("--")
            socket.to("game_" + gameId).emit("gameData", gameData);
        });

    });

});
