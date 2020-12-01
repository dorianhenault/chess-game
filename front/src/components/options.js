import React from 'react';

import '../index.css';
import {Modal, Button, FormControl, FormGroup, FormLabel} from "react-bootstrap";
import API from "../helpers/API";
import objectToPieceConverter from "../helpers/object-to-piece-helper";

export default class Options extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSaveModalDisplayed: true,
            optionsGameId: this.props.gameId,
            isGameFull: false,
        }
    }

    handleChange = (event) => {
        this.setState({
            optionsGameId: parseInt(event.target.value)
        });
    };

    selectGameId = async () => {

        API.socket.emit("gameStartId", this.state.optionsGameId, (response) => {
            if (response.status !== "TOO_MANY_PLAYERS") {
                this.props.updateGamePlayer(response.status)
                this.updateGameFullErrorMessage(false);
                this.loadGame();
            } else {
                this.updateGameFullErrorMessage(true);
            }
        });

    }

    loadGame = async () => {

        try {
            const res = await API.loadGame(this.state.optionsGameId);
            let playerNumber = 0;
            if (res.status === 200) {
                if (res.data.playerTurn === 'white') {
                    playerNumber = 1;
                } else {
                    playerNumber = 2;
                }
                objectToPieceConverter.convertSquareObjectToPieces(res.data.board)
                this.props.updateGameInfos(this.state.optionsGameId, res.data.playerTurn, playerNumber, res.data.board, res.data.blackFallenSoldiers, res.data.whiteFallenSoldiers);

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

    updateGameFullErrorMessage = (bool) => {
        this.setState({
            isGameFull: bool
        })
    }

    saveModalDisplay = (bool) => {
        this.setState({
            isSaveModalDisplayed: bool
        });

    };

    selectGameIdDisplay() {

        return (
            <>

                <Modal show={this.state.isSaveModalDisplayed} onHide={() => this.saveModalDisplay(true)}>
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
                        {this.state.isGameFull ?
                            <div className="game-full">
                                The selected game is already full, choose another one
                            </div>
                            : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.selectGameId}>
                            Save ID
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }


    render() {
        return (
            <div>
                {this.selectGameIdDisplay()}
            </div>
        );
    }


}



