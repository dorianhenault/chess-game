const mongoose = require("mongoose");
const pieceSchema = mongoose.Schema(
    {
        player: {
            type: Number
        },
        style: {},
        initialPositions: {}
    }
)


const boardSchema = mongoose.Schema(
    {
        gameId: {
            type: Number,
            unique: true,
            required: true
        },
        playerTurn: {
            type: String,
            required: true
        },
        board: [pieceSchema],
        whiteFallenSoldiers: {},
        blackFallenSoldiers: {}
    }
)


module.exports = mongoose.model("Board", boardSchema);