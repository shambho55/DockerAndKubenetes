const express = require('express');

const apiRouter = express.Router();
const { getColor,getHostname } = require('../utils');

apiRouter.get('/',(req,res) => {

    const {format} = req.query // localhost/api?format=text

    const color = getColor();
    const hostname = getHostname();


    if(format == 'json'){
    res.json({
        color,
        hostname
    });
    }
    else{
        return res.send(`COLOR : ${color}, HOSTNAME : ${hostname}`);
    }

});

module.exports = {
    apiRouter,
};