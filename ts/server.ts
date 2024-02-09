const express = require('express');
const {Eta} = require('eta');

const app = express();
const eta = new Eta({views: __dirname+'/../views', cache: true});

app.use('/static', express.static('static'));
app.get('/', (req, res) => {
    res.status(200).send(eta.render('index.html', {}));
});
app.get('/:module', (req, res) => {
    res.status(200).send(eta.render(req.params.module+'/index.html', {module: req.params.module}));
});

app.listen(8080, '127.0.0.1', () => console.log('started'));