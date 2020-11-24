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
            game_id: 1,
            isSaveModalDisplayed : false,
            isLoadModalDisplayed : false
        }
    }

    saveGame = async () => {
        try {
            const {data} = await API.save_game(this.state.game_id, this.props.turn, this.props.squares, this.props.blackFallenSoldiers, this.props.whiteFallenSoldiers);
        } catch (error) {
            console.error(error);
        }

        this.saveModalDisplay(false);
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

                this.props.loadGame(res.data.player_turn, player_number, res.data.board, res.data.blackFallenSoldiers, res.data.whiteFallenSoldiers);
                this.loadModalDisplay(false);

            } else {
                console.log("loading failed");
            }


        } catch (error) {
            console.error(error);
        }
    };

    handleChange = (event) => {
        this.setState({
            game_id: parseInt(event.target.value)
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


    saveGameDisplay() {

        return (
            <>
                <div className="form-group">
                    <Button onClick={() => this.saveModalDisplay(true)} variant="secondary" type="button">
                        Save Game
                    </Button>
                </div>

                <Modal show={this.state.isSaveModalDisplayed} onHide={() => this.saveModalDisplay(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Game ID ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <FormGroup className="form-group" variant="secondary">
                            <FormControl
                                className="form-control form-control-sm"
                                defaultValue={this.state.game_id}
                                onChange={this.handleChange}
                                type="game_id"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.saveModalDisplay(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.saveGame}>
                            Save
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
                                defaultValue={this.state.game_id}
                                onChange={this.handleChange}
                                type="game_id"
                            />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.loadModalDisplay(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.loadGame}>
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
                {this.saveGameDisplay()}
                {this.loadGameDisplay()}
            </div>
        );
    }


}


