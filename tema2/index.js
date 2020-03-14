'use strict';

const { App } = require('./utils/app');
const app = new App();
const router = require('./public/routes/users');
const initModules = require('./modules/initModules');

app.register(router);

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