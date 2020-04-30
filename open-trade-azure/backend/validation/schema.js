'use strict';

const ID = {
    type: 'string',
    pattern: /^[0-9a-fA-F]{24}$/
};

module.exports = {
    ID: ID,
    transaction: {
        type: 'object',
        properties: {
            source: {
                type: 'string'
            },
            destination: {
                type: 'string'
            },
            productId: ID,
            description: {
                type: 'string'
            }
        },
        required: ['source', 'productId']
    },
    product: {
        type: 'object',
        properties: {
            origin: {
                type: 'string'
            },
            name: {
                type: 'string'
            },
            description: {
                type: 'string'
            },
            required: ['origin', 'name']
        }
    },
    user: {
        type: 'object',
        properties: {
            location: {
                type: 'object',
                properties: {
                    lat: {
                        type: 'number'
                    },
                    lng: {
                        type: 'number'
                    }
                }
            },
            name: {
                type: 'string',
                minLength: 3
            },
            email: {
                type: 'string'
            },
            required: ['email', 'name', 'location']
        }
    }
};