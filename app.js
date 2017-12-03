const express = require('express');
const app = express();
const process = require('process');
const fetch = require('node-fetch');

const ctrlBaseUrl = 'http://192.168.1.100';

const first = {
    ip: `${ctrlBaseUrl}:85`,
};
const second = {
    ip: `${ctrlBaseUrl}:3051`,
};

const ctrls = [
    first,
    second,
];

ctrls.forEach((x, idx) => fetch(`${x.ip}/connect`).then(() => ctrls[idx].connected = true));

app.get('/toggle/:id', (req, res) => {
    const id = +req.params.id;
    res.setHeader('Content-Type', 'application/json');
    fetch(`${ctrls[id].ip}/toggle`)
        .then((data) => res.status(200).send({ message: 'controller status toggled' }))
        .catch((error) => res.status(500).send({ message: 'contoller is not available' }));
});

app.get('/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(ctrls.filter((x) => x.connected))
})

app.get('/status/:id', (req, res) => {
    const id = +req.params.id;
    res.setHeader('Content-Type', 'application/json');
    axios(`${ctrls[id].ip}/status`)
        .then(data => res.send({ status: data.status }))
        .catch((error) => res.status(500).send({ message: 'contoller is not available' }));
});


app.listen(3000, () => console.log('PORT: 3000'));

process.on('SIGINT', () => {
    ctrls.forEach((x) => fetch(`${x.ip}/disconnect`));
    setInterval(() => process.exit(), 100);
});
