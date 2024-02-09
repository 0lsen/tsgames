import {Module} from "./server/model/Module";

const express = require('express');
const {Eta} = require('eta');

const app = express();
const eta = new Eta({views: __dirname+'/../views', cache: true});

app.use('/static', express.static('static'));
app.get('/', (req, res) => {
    res.status(200).send(eta.render('index.html', {
        games: [
            new Module('bs', 'Battleship'),
            new Module('mw', 'Minesweeper'),
            new Module('peso', 'Peg Solitaire'),
            new Module('snake', 'Snake'),
            new Module('ttt', 'Tic Tac Toe'),
            new Module('ttt3d', 'Tic Tac Toe 3D'),
            new Module('xmas', 'X-Mas Special'),
        ],
        nongames: [
            new Module('cadi', 'Canvas Dickery'),
            new Module('ciso', 'Circle Sort'),
            new Module('cotra', 'Complex Number 2D Transformation'),
            new Module('gol', 'Conway\'s Game of Life'),
            new Module('liro', 'Lightroom'),
            new Module('sabo', 'Sandbox'),

        ]
    }));
});
app.get('/:module', (req, res) => {
    res.status(200).send(eta.render(req.params.module+'/index.html', {module: req.params.module}));
});

app.listen(8080, '127.0.0.1', () => console.log('started'));