'use strict';

const http = require('http');
const url = require('url');

function getParamsNames(regexp, str) {
    const array = [ ...str.matchAll(regexp) ];

    return array.map(m => m[0].split(':')[1]);
}

function getFirstGroup(regexp, str) {
    const array = [ ...str.matchAll(regexp) ];

    return array[0];
}

class App {
    constructor() {
        this.routes = {};
    };

    register(router) {
        if (!(router instanceof Router)) {
            throw new Error(
                'Invalid router format'
            )
        }

        this.routes = {
            ... this.routes,
            ... router.store
        };
    }

    listen(port=3000) {
        this.server = http.createServer((req, res) => {
            const parsedUrl = url.parse(req.url);
            const method = req.method;
            const resApp = {
                ... res,
                json: (obj, statusCode=200) => {
                    if (!(obj instanceof Object)) {
                        throw new Error('Invalid object');
                    }

                    res.writeHead(statusCode, { 
                        'Content-type': 'application/json' 
                    });
                    res.end(JSON.stringify(obj));
                }
            };
            const reqApp = {
                ... req,
                query: parsedUrl.query
            };

            if (['POST', 'PUT'].includes(method)) {
                let body = [];

                req
                    .on('data', chunk => {
                        body.push(chunk);
                    })
                    .on('end', () => {
                        body = Buffer.concat(body).toString();
                        reqApp.requestBody = body;
                    });
            }

            Object.keys(this.routes).forEach(path => {
                const re = new RegExp(this.routes[path].path);

                if (parsedUrl.pathname.match(re) && method === this.routes[path].method) {
                    const matches = getFirstGroup(re, parsedUrl.pathname);
                    const params = {};
                    
                    for (let i = 1; i < matches.length; i++) {
                        params[this.routes[path].params[i - 1]] = matches[i];
                    }

                    resApp.params = params;

                    return this.routes[path].handler(reqApp, resApp);
                }
            });
            
            resApp.json({
                message: 'The required path does not exist!'
            }, 404);
        });

        this.server.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    }
}

class Router {
    constructor() {
        this.store = {};
    }

    assignHandler(method, path, handler) {
        const pattern = /:[a-zA-Z0-0]+/g;
        const matches = getParamsNames(pattern, path);
        const pPath = path.replace(pattern, '([a-zA-Z0-0-]+)');
        const pth = `${method}_${path}`;

        if (!this.store.hasOwnProperty(pth)) {
            this.store[pth] = {
                method,
                handler,
                path: `${pPath}$`,
                params: matches
            };
        }
    }

    get(path, callback) {
        this.assignHandler('GET', path, callback);
    }

    post(path, callback) {
        this.assignHandler('POST', path, callback);
    }

    delete() {
        this.assignHandler('DELETE', path, callback);
    }

    put() {
        this.assignHandler('PUT', path, callback);
    }
}

module.exports = { 
    App,
    Router
}