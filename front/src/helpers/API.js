import axios from "axios";

const headers = {
    "Content-Type": "application/json"
};
const url = "http://localhost:8000";

export default {
    save_game: function (gameId, player_turn, board, blackFallenSoldiers, whiteFallenSoldiers) {
        return axios.post(
            `${url}/save`,
            {
                gameId,
                player_turn,
                board,
                blackFallenSoldiers,
                whiteFallenSoldiers
            },
            {
                headers: headers
            }
        );
    },

    load_game: function (gameId) {
        return axios.post(
            `${url}/load`,
            {
                gameId,
            },
            {
                headers: headers
            }
        );
    }
};