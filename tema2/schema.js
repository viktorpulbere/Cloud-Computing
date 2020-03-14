'use strict';

module.exports = {
    user: {
        type: 'object',
        properties: {
            firstName: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            lastName: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            email: {
                type: 'string',
                pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            },
            job: {
                type: 'string',
                minLength: 3,
                maxLength: 10
            }
        },
        required: ['firstName', 'lastName', 'email', 'job']
    },
    ID: {
        type: 'string',
        pattern: /^[0-9a-fA-F]{24}$/
    }
};