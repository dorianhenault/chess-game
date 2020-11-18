const Board = require("../schema/schemaBoard.js");

async function saveGame(req, res) {
    const {game_id, player_turn, board, whiteFallenSoldiers, blackFallenSoldiers} = req.body;
    if (player_turn === 'white' || player_turn === 'black') {
        try {
            let findBoard = await Board.findOne({game_id: game_id});
            if (findBoard !== null) {
                findBoard.board = board;
                findBoard.player_turn = player_turn;
                findBoard.whiteFallenSoldiers = whiteFallenSoldiers;
                findBoard.blackFallenSoldiers = blackFallenSoldiers;
                await findBoard.save();

            } else {
                findBoard = new Board(
                    {
                        game_id: 1,
                        player_turn: player_turn,
                        board: board,
                        whiteFallenSoldiers: whiteFallenSoldiers,
                        blackFallenSoldiers: blackFallenSoldiers
                    }
                );

                await findBoard.save();
            }
            return res.status(200).json({
                text: "Success",
                game_id: game_id,
                player_turn: player_turn
            });
        } catch (error) {
            return res.status(500).json({error});
        }

    } else {
        return res.status(500).json({text: "Player turn is not white nor black"});
    }

}

async function loadGame(req, res) {
    const {game_id} = req.body;

    try {

        let findBoard = await Board.findOne({game_id: game_id});
        if (findBoard !== null) {
            return res.status(200).json({
                game_id: findBoard.game_id,
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
        return res.status(500).json({error});
    }


}

exports.saveGame = saveGame;
exports.loadGame = loadGame