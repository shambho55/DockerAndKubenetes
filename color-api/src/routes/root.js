const express = require('express');
const { getColor, getHostname } = require('../utils');

const rootRouter = express.Router();

rootRouter.get('/',(req,res) => {
    const color = getColor();
    const hostname = getHostname();
    res.send(`<h1 style="color:${color};">Hello from color-api!</h1>
<h2>Hostname:${hostname}</h2>`);
});

module.exports = {
    rootRouter,
};