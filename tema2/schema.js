'use strict';

const ID = {
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/
};
const device = {
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
};

module.exports = {
    ID: ID,
    device: device,
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
    },
    putDevices: {
        type: 'array',
        items: device
    }
};