import axios from "axios";
import socketIOClient from "socket.io-client";


const headers = {
    "Content-Type": "application/json"
};
const url = "http://localhost:8000";
const socket = socketIOClient(url);

export default {
    saveGame: function (gameId, playerTurn, board, blackFallenSoldiers, whiteFallenSoldiers) {
        return axios.post(
            `${url}/save`,
            {
                gameId,
                playerTurn,
                board,
                blackFallenSoldiers,
                whiteFallenSoldiers
            },
            {
                headers: headers
            }
        );
    },

    loadGame: function (gameId) {
        return axios.post(
            `${url}/load`,
            {
                gameId,
            },
            {
                headers: headers
            }
        );
    },

    socket

};