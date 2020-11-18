import axios from "axios";

const headers = {
    "Content-Type": "application/json"
};
const url = "http://localhost:8000";

export default {
    save_game: function (game_id, player_turn, board, blackFallenSoldiers, whiteFallenSoldiers) {
        return axios.post(
            `${url}/save`,
            {
                game_id,
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

    load_game: function (game_id) {
        return axios.post(
            `${url}/load`,
            {
                game_id,
            },
            {
                headers: headers
            }
        );
    }
};