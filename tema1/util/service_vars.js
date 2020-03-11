'use strict';

const _ = require('lodash');

class ServiceVars {
    constructor() {
        this.vars = {};
    }

    get(name) {
        return _.get(this.vars, `.${name}`, null);
    }

    set(name, value) {
        _.set(this.vars, `.${name}`, value);
    }
}

module.exports = new ServiceVars();