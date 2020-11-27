import React from 'react';

import '../index.css';
import {Modal, Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import API from "../helpers/API";
import Bishop from "../pieces/bishop";
import King from "../pieces/king";
import Knight from "../pieces/knight";
import Pawn from "../pieces/pawn";
import Queen from "../pieces/queen";
import Rook from "../pieces/rook";

const pieceUrls = require('../dictionaries/piecesUrls.json');


export default class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSaveModalDisplayed: true,
            isLoadModalDisplayed: false,
            optionsGameId: this.props.gameId
        }

        API.socket.on("gameData", (data) => {
            this.loadGameBis(data.gameId, data.turn, data.player, data.squares, data.blackFallenSoldiers, data.whiteFallenSoldiers)
        });
    }

    loadGameBis(gameId, player_turn, player_number, squares, blackFallenSoldiers, whiteFallenSoldiers) {

        const pieceClasses = new Map([['Bishop', Bishop], ['King', King], ['Knight', Knight], ['Pawn', Pawn], ['Queen', Queen], ['Rook', Rook]]);
        squares.forEach(function (part, index, arr) {
            if (arr[index]) {
                let pieceUrl = arr[index].style.backgroundImage;
                for (let pieceUrlsKey in pieceUrls) {
                    if (pieceUrl.includes(pieceUrls[pieceUrlsKey]["white"]) || pieceUrl.includes(pieceUrls[pieceUrlsKey]["black"])) {
                        arr[index] = Object.assign(new (pieceClasses.get(pieceUrlsKey)), arr[index]);
                    }
                }
            }
        });

        this.props.updateGameInfos(gameId, player_turn, player_number, squares, blackFallenSoldiers, whiteFallenSoldiers);

    }

    handleChange = (event) => {
        this.setState({
            optionsGameId: parseInt(event.target.value)
        });
    };

    loadGame = async (isGameIdLoad) => {

        try {
            //todo handle when too many players on game id
            if (isGameIdLoad) {
                API.socket.emit("gameStartId", this.state.optionsGameId, (response) => {
                    console.log(response.status)
                    if (response.status !== "TOO_MANY_PLAYERS") {
                        this.props.updateGamePlayer(response.status)
                    } else {

                    }
                });
            }
            const res = await API.load_game(this.state.optionsGameId);
            let player_number = 0;
            if (res.status === 200) {
                if (res.data.player_turn === 'white') {
                    player_number = 1;
                } else {
                    player_number = 2;
                }

                const pieceClasses = new Map([['Bishop', Bishop], ['King', King], ['Knight', Knight], ['Pawn', Pawn], ['Queen', Queen], ['Rook', Rook]]);
                res.data.board.forEach(function (part, index, arr) {
                    if (arr[index]) {
                        let pieceUrl = arr[index].style.backgroundImage;
                        for (let pieceUrlsKey in pieceUrls) {
                            if (pieceUrl.includes(pieceUrls[pieceUrlsKey]["white"]) || pieceUrl.includes(pieceUrls[pieceUrlsKey]["black"])) {
                                arr[index] = Object.assign(new (pieceClasses.get(pieceUrlsKey)), arr[index]);
                            }
                        }
                    }
                });

                this.props.updateGameInfos(this.state.optionsGameId, res.data.player_turn, player_number, res.data.board, res.data.blackFallenSoldiers, res.data.whiteFallenSoldiers);
                this.loadModalDisplay(false);

            } else {
                console.log("loading failed");
            }

        } catch (error) {
            console.error(error);
            this.props.updateGameId(this.state.optionsGameId);
        }

        this.saveModalDisplay(false);
    };

    handleChange = (event) => {
        this.setState({
            optionsGameId: parseInt(event.target.value)
        });
    };

    saveModalDisplay = (bool) => {
        this.setState({
            isSaveModalDisplayed: bool
        });

    };

    loadModalDisplay = (bool) => {
        this.setState({
            isLoadModalDisplayed: bool
        });
    };


    selectGameIdDisplay() {

        return (
            <>

                <Modal show={this.state.isSaveModalDisplayed} onHide={() => this.saveModalDisplay(true)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Game ID ? (Default 1)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup className="form-group" variant="secondary">
                            <FormControl
                                className="form-control form-control-sm"
                                defaultValue={this.state.optionsGameId}
                                onChange={this.handleChange}
                                type="optionsGameId"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={() => this.loadGame(true)}>
                            Save ID
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    loadGameDisplay() {


        return (
            <>
                <div className="form-group">
                    <Button onClick={() => this.loadModalDisplay(true)} variant="secondary" type="button">
                        Load Game
                    </Button>
                </div>

                <Modal show={this.state.isLoadModalDisplayed} onHide={() => this.loadModalDisplay(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Game ID ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup className="form-group" variant="secondary">
                            <FormControl
                                className="form-control form-control-sm"
                                defaultValue={this.state.optionsGameId}
                                onChange={this.handleChange}
                                type="optionsGameId"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.loadModalDisplay(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => this.loadGame(false)}>
                            Load
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }


    render() {
        return (
            <div className="form-group">
                <h3>Options</h3>
                {this.selectGameIdDisplay()}
                {this.loadGameDisplay()}
            </div>
        );
    }


}



