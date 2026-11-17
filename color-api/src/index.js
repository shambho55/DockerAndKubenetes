const express = require('express');
const os = require('os');
const path = require('path');

const { healthRouter } = require('./routes/health');
const { apiRouter } = require('./routes/api');
const { rootRouter } = require('./routes/root');

const app = express();
const port = 8080;


const delay_startup = process.env.DELAY_STARTUP === 'true';

console.log(`Delay Startup : ${delay_startup}`);

app.use('/api', apiRouter);
app.use('/', healthRouter);
app.use('/', rootRouter);

if(delay_startup){

    const start = Date.now();

    // Purposefully block event loop and execution for 60 seconds.
    // To illustrate startup probes.
    while(Date.now() - start < 60000){}

}

app.listen(port, () => {
    console.log(`Color API listening on port:${port}`);
});