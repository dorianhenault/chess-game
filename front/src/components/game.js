import React from 'react';

import '../index.css';
import Board from './board.js';
import King from '../pieces/king'
import FallenSoldierBlock from './fallen-soldier-block.js';
import initialiseChessBoard from '../helpers/board-initialiser.js';
import API from "../helpers/API";
import {Button, FormGroup, FormControl, FormLabel} from "react-bootstrap";
import board from "./board.js";
import knight from "../pieces/knight";
import Knight from "../pieces/knight";
import Bishop from "../pieces/bishop";
import Piece from "../pieces/piece";
import Rook from "../pieces/rook";


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
            game_id: 1
        }
    }

    handleClick(i) {
        const squares = [...this.state.squares];

        if (this.state.sourceSelection === -1) {
            if (!squares[i] || squares[i].player !== this.state.player) {
                this.setState({status: "Wrong selection. Choose player " + this.state.player + " pieces."});
                if (squares[i]) {
                    squares[i].style = {...squares[i].style, backgroundColor: ""};
                }
            } else {
                squares[i].style = {...squares[i].style, backgroundColor: "RGB(111,143,114)"}; // Emerald from http://omgchess.blogspot.com/2015/09/chess-board-color-schemes.html
                this.setState({
                    status: "Choose destination for the selected piece",
                    sourceSelection: i
                })
            }
            return
        }

        squares[this.state.sourceSelection].style = {...squares[this.state.sourceSelection].style, backgroundColor: ""};

        if (squares[i] && squares[i].player === this.state.player) {
            this.setState({
                status: "Wrong selection. Choose valid source and destination again.",
                sourceSelection: -1,
            });
        } else {

            const whiteFallenSoldiers = [];
            const blackFallenSoldiers = [];
            const isDestEnemyOccupied = Boolean(squares[i]);
            //console.log(squares[this.state.sourceSelection]);
            const isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, isDestEnemyOccupied);

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
                const isCheckMe = this.isCheckForPlayer(squares, this.state.player)

                if (isCheckMe) {

                    const isCheckMate = this.isCheckMateForPlayer(squares, this.state.player)
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
                    }));
                }
            } else {
                this.setState({
                    status: "Wrong selection. Choose valid source and destination again.",
                    sourceSelection: -1,
                });
            }
        }
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

    saveGame = async () => {
        try {
            const {data} = await API.save_game(1, this.state.turn, this.state.squares, this.state.blackFallenSoldiers, this.state.whiteFallenSoldiers);
        } catch (error) {
            console.error(error);
        }
    };

    loadGame = async () => {
        try {
            const res = await API.load_game(this.state.game_id);
            let player_number = 0;
            if (res.status === 200) {
                if (res.data.player_turn === 'white') {
                    player_number = 1;
                } else {
                    player_number = 2;
                }

              /*  res.data.board.forEach(function (part, index, arr) {
                    if (arr[index]) {
                        arr[index] = Object.assign(new TODO ASSIGN ALL PIECES(), arr[index]);
                        console.log(arr[index]);

                    }
                });*/

                this.setState({
                    turn: res.data.player_turn,
                    player: player_number,
                    squares: res.data.board,
                    blackFallenSoldiers: res.data.blackFallenSoldiers,
                    whiteFallenSoldiers: res.data.whiteFallenSoldiers,
                    sourceSelection: -1,
                    status: '',
                })
            } else {
                console.log("loading failed");
            }


        } catch (error) {
            console.error(error);
        }
    };

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

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

                <div className="Save">
                    <button onClick={this.saveGame} type="submit">
                        SaveGame
                    </button>
                </div>
                <div className="Load Game">
                    <FormGroup controlId="game_id" variant="secondary" size="sm">
                        <FormLabel>Game ID</FormLabel>
                        <FormControl
                            value={this.state.game_id}
                            onChange={this.handleChange}
                            type="game_id"
                        />
                    </FormGroup>
                    <Button onClick={this.loadGame} block variant="secondary" size="sm" type="button">
                        Load Game
                    </Button>
                </div>

            </div>

        );
    }
}

