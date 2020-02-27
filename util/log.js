'use strict';

const path = require('path');
const fs = require('fs');

const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'log_data/access.log'), 
    { flags: 'a' }
);

module.exports = (response) => {
    const path = response.request.path.replace(/key=(.{14}|.{34})&/, 'key=SECRET_KEY&');
    
    accessLogStream.write(
`
---------------------------------------------------------------------
[${response.headers.date}] INFO:
    request: {
        method: "${response.request.method}",
        host: "${response.request.socket._host}",
        path: "${path}"
    },
    response: {
        latency: ${new Date() - response.config.metadata.startTime},
        statusCode: ${response.status}
    }
---------------------------------------------------------------------
`
    );
};