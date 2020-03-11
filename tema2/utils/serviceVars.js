'use strict';

class ServiceVars {
    constructor() {
        this.store = {};
    }

    get(key) {
        if (!this.store.hasOwnProperty(key)) {
            return null;
        }

        return this.store[key];
    }

    set(key, value) {
        if (key instanceof String && !this.store.hasOwnProperty(key)) {
            this.store[key] = value;
        }
    }
}

module.exports = new ServiceVars();
