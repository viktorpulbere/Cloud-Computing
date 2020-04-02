'use strict';

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const products = require('./public/api/products');
const transactions = require('./public/api/transactions');
const users = require('./public/api/users');
const initModules = require('./modules');
const { normalizePort } = require('./utils/utils');

const PORT = normalizePort(process.env.PORT || 9083);

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', products);
app.use('/transactions', transactions);
app.use('/users', users);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            message: `${err.name}: ${err.message}`,
            error_code: 11010
        });
    }
});

// Handle 404 error
app.use((req, res) => {
    res.statusCode = 404;
    res.send({
        error_code: 1100,
        message: 'The required path does not exist!',
        data: {
            url: req.url,
            method: req.method
        }
    });
});

async function start() {
    try {
        await initModules();

        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    } catch (err) {
        console.error('Application init error!');
        console.error(err.toString());
        process.exit(1);
    }
}

start();
