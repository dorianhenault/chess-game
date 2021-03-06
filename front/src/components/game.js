import React from 'react';

import '../index.css';
import Board from './board.js';
import FallenSoldierBlock from './fallen-soldier-block.js';
import initialiseChessBoard from '../helpers/board-initialiser.js';
import King from "../pieces/king";
import Options from "./options";
import API from "../helpers/API";
import objectToPieceConverter from "../helpers/object-to-piece-helper";


export default class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            squares: initialiseChessBoard(),
            whiteFallenSoldiers: [],
            blackFallenSoldiers: [],
            player: 1,
            sourceSelection: -1,
            status: '',
            turn: 'white',
            gameId: 1,
            myPlayer: 0,
            myTurn: 'none'
        }
        this.updateGameInfos = this.updateGameInfos.bind(this);
        this.updateGameId = this.updateGameId.bind(this);
        this.updateGamePlayer = this.updateGamePlayer.bind(this);

        API.socket.on("gameData", (data) => {
            this.updateOpponentMove(data.gameId, data.turn, data.player, data.squares, data.blackFallenSoldiers, data.whiteFallenSoldiers)
        });
    }

    handleClick(i) {
        const squares = [...this.state.squares];

        if (this.state.player === this.state.myPlayer) {

            if (this.state.sourceSelection === -1) {
                if (!squares[i] || squares[i].player !== this.state.myPlayer) {
                    this.setState({status: "Wrong selection. Choose player " + this.state.myPlayer + " pieces."});
                    if (squares[i]) {
                        squares[i].style = {...squares[i].style, backgroundColor: ""};
                    }
                } else {
                    squares[i].style = {...squares[i].style, backgroundColor: "RGB(111,143,114)"};
                    this.setState({
                        status: "Choose destination for the selected piece",
                        sourceSelection: i
                    })
                }
                return
            }

            squares[this.state.sourceSelection].style = {
                ...squares[this.state.sourceSelection].style,
                backgroundColor: ""
            };

            if (squares[i] && squares[i].player === this.state.myPlayer) {
                this.setState({
                    status: "Wrong selection. Choose valid source and destination again.",
                    sourceSelection: -1,
                });
            } else {
                const whiteFallenSoldiers = [];
                const blackFallenSoldiers = [];
                const isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, squares);

                if (isMovePossible) {
                    if (squares[i] !== null) {
                        if (squares[i].player === 1) {
                            whiteFallenSoldiers.push(squares[i]);
                        } else {
                            blackFallenSoldiers.push(squares[i]);
                        }
                    }

                    squares[i] = squares[this.state.sourceSelection];
                    squares[this.state.sourceSelection] = null;
                    const isCheckMe = this.isCheckForPlayer(squares, this.state.myPlayer)

                    if (isCheckMe) {

                        const isCheckMate = this.isCheckMateForPlayer(squares, this.state.myPlayer)
                        if (isCheckMate) {
                            this.setState(oldState => ({
                                status: "Check Mate!",
                                sourceSelection: -1,
                            }))
                        } else {
                            this.setState(oldState => ({
                                status: "Wrong selection. Choose valid source and destination again. Now you have a check!",
                                sourceSelection: -1,
                            }))
                        }

                    } else {
                        let player = this.state.player === 1 ? 2 : 1;
                        let turn = this.state.turn === 'white' ? 'black' : 'white';

                        this.setState(oldState => ({
                            sourceSelection: -1,
                            squares,
                            whiteFallenSoldiers: [...oldState.whiteFallenSoldiers, ...whiteFallenSoldiers],
                            blackFallenSoldiers: [...oldState.blackFallenSoldiers, ...blackFallenSoldiers],
                            player,
                            status: '',
                            turn
                        }), () => {
                            this.saveGame();
                        });


                    }
                } else {
                    this.setState({
                        status: "Wrong selection. Choose valid source and destination again.",
                        sourceSelection: -1,
                    });
                }
            }

        }
    }


    updateOpponentMove(gameId, playerTurn, playerNumber, squares, blackFallenSoldiers, whiteFallenSoldiers) {
        objectToPieceConverter.convertSquareObjectToPieces(squares);
        this.updateGameInfos(gameId, playerTurn, playerNumber, squares, blackFallenSoldiers, whiteFallenSoldiers);
    }

    updateGameInfos(gameId, playerTurn, playerNumber, squares, blackFallenSoldiers, whiteFallenSoldiers) {
        this.setState({
            gameId: gameId,
            turn: playerTurn,
            player: playerNumber,
            squares: squares,
            blackFallenSoldiers: blackFallenSoldiers,
            whiteFallenSoldiers: whiteFallenSoldiers,
            sourceSelection: -1,
            status: ''
        });
    }

    updateGameId(gameId) {
        this.setState({
            gameId: gameId,
        });
    }

    updateGamePlayer(color) {
        this.setState({
            myPlayer: color === 'white' ? 1 : 2,
            myTurn: color,
        });
    }

    saveGame() {
        try {
            API.saveGame(this.state.gameId, this.state.turn, this.state.squares, this.state.blackFallenSoldiers, this.state.whiteFallenSoldiers);
        } catch (error) {
            console.error(error);
        }
        API.socket.emit("game_" + this.state.gameId, this.state)
    }

    getKingPosition(squares, player) {
        return squares.reduce((acc, curr, i) =>
            acc || //King may be only one, if we had found it, returned his position
            ((curr //current squre mustn't be a null
                && (curr.getPlayer() === player)) //we are looking for aspecial king
                && (curr instanceof King)
                && i), // returned position if all conditions are completed
            null)
    }

    isCheckForPlayer(squares, player) {
        const opponent = player === 1 ? 2 : 1
        const playersKingPosition = this.getKingPosition(squares, player)
        const canPieceKillPlayersKing = (piece, i) => piece.isMovePossible(playersKingPosition, i, squares)
        return squares.reduce((acc, curr, idx) =>
            acc ||
            (curr &&
                (curr.getPlayer() === opponent) &&
                canPieceKillPlayersKing(curr, idx)
                && true),
            false)
    }

    isCheckMateForPlayer(squares, player) {
        //todo
    }

    render() {

        return (
            <div>
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={this.state.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>

                    <div className="game-info">
                        <h3>My pieces</h3>
                        <div id="player-turn-box" style={{backgroundColor: this.state.myTurn}}>
                        </div>

                        <h3>Turn</h3>
                        <div id="player-turn-box" style={{backgroundColor: this.state.turn}}>
                        </div>
                        <div className="game-status">{this.state.status}</div>

                        <div className="fallen-soldier-block">
                            {<FallenSoldierBlock
                                whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                                blackFallenSoldiers={this.state.blackFallenSoldiers}
                            />
                            }
                        </div>

                    </div>
                </div>
                <Options
                    turn={this.state.turn}
                    player={this.state.player}
                    squares={this.state.squares}
                    blackFallenSoldiers={this.state.blackFallenSoldiers}
                    whiteFallenSoldiers={this.state.whiteFallenSoldiers}
                    updateGameInfos={this.updateGameInfos}
                    updateGameId={this.updateGameId}
                    updateGamePlayer={this.updateGamePlayer}
                    gameId={this.state.gameId}
                />

            </div>

        );
    }
}

