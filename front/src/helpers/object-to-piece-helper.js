import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Queen from "../pieces/queen";
import Rook from "../pieces/rook";

const pieceUrls = require('../dictionaries/piecesUrls.json');

export default {
    convertSquareObjectToPieces: function (board) {
        const pieceClasses = new Map([['Bishop', Bishop], ['King', King], ['Knight', Knight], ['Pawn', Pawn], ['Queen', Queen], ['Rook', Rook]]);
        board.forEach(function (part, index, arr) {
            if (arr[index]) {
                let pieceUrl = arr[index].style.backgroundImage;
                for (let pieceUrlsKey in pieceUrls) {
                    if (pieceUrl.includes(pieceUrls[pieceUrlsKey]["white"]) || pieceUrl.includes(pieceUrls[pieceUrlsKey]["black"])) {
                        arr[index] = Object.assign(new (pieceClasses.get(pieceUrlsKey)), arr[index]);
                    }
                }
            }
        });
    }

};