'use strict';

const http = require('http');

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
            const method = req.method;
            const path = `${method.toUpperCase()}_${req.url}`;
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

            if (this.routes.hasOwnProperty(path)) {
                return this.routes[path].handler(req, resApp);
            }
            
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
        const pth = `${method}_${path}`;

        if (!this.store.hasOwnProperty(pth)) {
            this.store[pth] = {
                method,
                handler
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