'use strict';

const ID = {
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/
};

module.exports = {
    ID: ID,
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
            status: {
                type: 'string',
                enum: [
                    'student', 'employee'
                ]
            }
        },
        required: [
            'firstName', 'lastName', 'email', 'status'
        ]
    },
    device: {
        type: 'object',
        properties: {
            type: {
                type: 'string',
                enum: [
                    'PC', 'PHONE', 'MAC', 'TV'
                ]
            },
            name: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            status: {
                type: 'number',
                enum: [1, 0]
            }
        },
        required: [
            'type', 'status'
        ]
    },
    updateDevice: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                minLength: 3,
                maxLength: 20
            },
            status: {
                type: 'number',
                enum: [1, 0]
            }
        },
        additionalProperties: false,
        anyOf: [{
            required: ['status']
        }, {
            required: ['name']
        }]
    },
    updateDevices: {
        type: 'object',
        properties: {
            status: {
                type: 'number',
                enum: [1, 0]
            }
        },
        additionalProperties: false,
        required: ['status']
    }
};