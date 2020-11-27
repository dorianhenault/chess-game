module.exports = {
    isPlayerPresent: function (gameId, playersInGame, color) {
        for (const player of playersInGame[gameId]) {
            if (player[0] === color) {
                return true;
            }
        }

        return false;
    },

    isSocketEligibleForGame: function(gameId, playersInGame, socketId) {
        for (const player of playersInGame[gameId]) {
            if (player[1] === socketId && player[0] === "TOO_MANY_PLAYERS") {
                return false;
            }
        }

        return true;
    },

    handlePlayerDisconnection: function (playersInGame, socketId) {
        for (const players of Object.values(playersInGame)) {
            for(let i = 0; i < players.length; i++){
                if (players[i][1] === socketId) {
                    players.splice(i, 1);
                }
            }
        }

    }
}