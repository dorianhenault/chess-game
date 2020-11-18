const mongoose = require("mongoose");
const pieceSchema = mongoose.Schema(
    {
        player: {
            type: Number,
            unique: true,
            required: true
        },
        style: {},
        initialPositions: {}
    }
)


const boardSchema = mongoose.Schema(
    {
        game_id: {
            type: Number,
            unique: true,
            required: true
        },
        player_turn: {
            type: String,
            required: true
        },
        board: [pieceSchema],
        whiteFallenSoldiers: {},
        blackFallenSoldiers: {}
    }
)


module.exports = mongoose.model("Board", boardSchema);