'use strict';

class ServiceVars {
    set(key, value) {
        if (typeof key === 'string' && ['get', 'set'].includes(key)) {
            throw new Error('Method override now allowed');
        }

        this[key] = value;
    }

    get(key) {
        return this[key];
    }
}

module.exports = new ServiceVars();