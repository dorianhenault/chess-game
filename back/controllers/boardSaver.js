const Board = require("../schema/schemaBoard.js");

async function saveGame(req, res) {
    const {gameId, playerTurn, board, whiteFallenSoldiers, blackFallenSoldiers} = req.body;
    if (playerTurn === 'white' || playerTurn === 'black') {
        try {
            let findBoard = await Board.findOne({gameId: gameId});
            if (findBoard !== null) {
                findBoard.board = board;
                findBoard.playerTurn = playerTurn;
                findBoard.whiteFallenSoldiers = whiteFallenSoldiers;
                findBoard.blackFallenSoldiers = blackFallenSoldiers;
            } else {
                findBoard = new Board(
                    {
                        gameId: gameId,
                        playerTurn: playerTurn,
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
                playerTurn: playerTurn
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
                playerTurn: findBoard.playerTurn,
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