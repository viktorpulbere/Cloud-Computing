'use strict';

const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

require('dotenv').config();

const home = require('./public/routes/home');
const metrics = require('./public/routes/metrics');
const api = require('./public/routes/api');

app.set('view engine', 'ejs');
app.use(serveStatic(
    path.join(__dirname, 'public')
));

app.use('/', home);
app.use('/metrics', metrics);
app.use('/api/v1', api);

app.listen(3000, () => {
    console.log(`Server listening on port 3000`);
});