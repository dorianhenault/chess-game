const Board = require("../schema/schemaBoard.js");

async function saveGame(req, res) {
    const {gameId, player_turn, board, whiteFallenSoldiers, blackFallenSoldiers} = req.body;
    if (player_turn === 'white' || player_turn === 'black') {
        try {
            let findBoard = await Board.findOne({gameId: gameId});
            if (findBoard !== null) {
                findBoard.board = board;
                findBoard.player_turn = player_turn;
                findBoard.whiteFallenSoldiers = whiteFallenSoldiers;
                findBoard.blackFallenSoldiers = blackFallenSoldiers;
            } else {
                findBoard = new Board(
                    {
                        gameId: gameId,
                        player_turn: player_turn,
                        board: board,
                        whiteFallenSoldiers: whiteFallenSoldiers,
                        blackFallenSoldiers: blackFallenSoldiers
                    }
                );
            }

            await findBoard.save();
            return res.status(200).json({
                text: "Success",
                gameId: gameId,
                player_turn: player_turn
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({error});
        }

    } else {
        return res.status(500).json({text: "Player turn is not white nor black"});
    }

}

async function loadGame(req, res) {
    const {gameId} = req.body;

    try {

        let findBoard = await Board.findOne({gameId: gameId});
        if (findBoard !== null) {
            return res.status(200).json({
                gameId: findBoard.gameId,
                board: findBoard.board,
                player_turn: findBoard.player_turn,
                whiteFallenSoldiers: findBoard.whiteFallenSoldiers,
                blackFallenSoldiers: findBoard.blackFallenSoldiers
            });

        } else {
            return res.status(404).json({
                text: "Save not found"
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({error});
    }


}

exports.saveGame = saveGame;
exports.loadGame = loadGame