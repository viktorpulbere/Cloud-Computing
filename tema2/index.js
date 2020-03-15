'use strict';

const { App } = require('./utils/app');
const userRouter = require('./public/routes/users');
const deviceRouter = require('./public/routes/devices');
const initModules = require('./modules/initModules');

const app = new App();

app.register(userRouter);
app.register(deviceRouter);

async function start() {
    try {
        await initModules();
        app.listen();
    } catch (err) {
        console.error('Could not init modules');
        process.exit(1);
    }
}

start();