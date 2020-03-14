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

async function parseBody(req, reqApp, method) {
    return new Promise((resolve, reject) => {
        let body = [];

        req
            .on('data', chunk => {
                body.push(chunk);
            })
            .on('end', () => {
                body = Buffer.concat(body).toString();

                if (body && body.indexOf('{') !== -1) {
                    reqApp.body = JSON.parse(body);
                }

                resolve();
            })
            .on('error', () => {
                reject();
            });
    });
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
            let exists = 0;

            Object.keys(this.routes).forEach(async path => {
                const re = this.routes[path].path;
                
                if (parsedUrl.pathname.match(re) && this.routes[path].method.includes(method)) {
                    const matches = getFirstGroup(re, parsedUrl.pathname);
                    const methodIdx = this.routes[path].method.indexOf(method);
                    const params = {};
                    exists = 1;
                    
                    for (let i = 1; i < matches.length; i++) {
                        params[this.routes[path].params[i - 1]] = matches[i];
                    }

                    reqApp.params = params;
                    await parseBody(req, reqApp, method);
                    return this.routes[path].handler[methodIdx](reqApp, resApp);
                }
            });

            if (!exists) {
                resApp.json({
                    message: 'The required path does not exist!'
                }, 404);
            }
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
        const pPath = path.replace(pattern, '([a-zA-Z0-9-]+)');

        if (!this.store.hasOwnProperty(pPath)) {
            this.store[pPath] = {
                method: [method],
                handler: [handler],
                path: new RegExp(`${pPath}$`),
                params: matches
            };

            return;
        }

        if (this.store.hasOwnProperty(pPath) && !this.store[pPath].method.includes(method)) {
            this.store[pPath].method.push(method);
            this.store[pPath].handler.push(handler);
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