const board = require('./boardSaver.js');

module.exports = function (app) {
    app.post('/save', board.saveGame);
    app.post('/load', board.loadGame);
}