'use strict';

const {env} = process;

module.exports = {
    mongo: {
        url: env.MONGO_URL,
        password: env.MONGO_PASSWORD,
        db: 'open_trade',
        collections: {
            users: 'users',
            products: 'products',
            transactions: 'transactions',
            blockchain: 'blockchain'
        }
    },
    redis: {
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        socket_keepalive: true
    },
    oidc: {
        issuer: env.OIDC_ISSUER,
        jwksUri: env.OIDC_JWKS,
        audience: env.OIDC_AUDIENCE
    },
    web3: {
        url: env.WEB3_URL,
        contract_address: env.CONTRACT_ADDRESS,
        abi: [{
            "inputs": [{
                "internalType": "string",
                "name": "productKey",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "destination",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }],
            "name": "addTransaction",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "string",
                "name": "key",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "origin",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "hash",
                "type": "string"
            }],
            "name": "createProduct",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "inputs": [{
                "internalType": "string",
                "name": "productKey",
                "type": "string"
            }],
            "name": "getLastTransaction",
            "outputs": [{
                "internalType": "string",
                "name": "",
                "type": "string"
            }, {
                "internalType": "string",
                "name": "",
                "type": "string"
            }],
            "stateMutability": "view",
            "type": "function"
        }]
    }
};
