'use strict';

const {MongoClient} = require('mongodb');
const {createClient} = require('redis');
const {promisify} = require('util');

const {mongo, redis, web3: web3Config} = require('./config');
const shared = require('./utils/service_vars');

const Web3 = require('web3');
const crypto = require('crypto');


async function initMongo() {
    const client = await MongoClient.connect(mongo.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    console.log('Connected successfully to mongo server');
    shared.mongo = {};

    const db = client.db(mongo.db);

    Object.keys(mongo.collections).forEach(collectionName => {
        shared.mongo[collectionName] = db.collection(mongo.collections[collectionName]);
    });

    await Promise.all([
        db.collection('users').createIndex({userId: 1}, {sparse: true, unique: true}),
        db.collection('transactions').createIndex({source: 1, destination: 1}, {}),
        db.collection('transactions').createIndex({productId: 1}, {})
    ]);

}

async function initRedis() {
    return new Promise((resolve, reject) => {
        const client = createClient(redis);

        client.on('connect', () => {
            shared.redis = {
                set: promisify(client.set).bind(client),
                keys: promisify(client.keys).bind(client),
                del: promisify(client.del).bind(client),
                get: promisify(client.get).bind(client)
            };

            return resolve();
        });

        client.on('error', (err) => {
            console.error(err);

            return reject(err);
        });
    });
}

async function initWeb3() {
    const web3 = new Web3(web3Config.url);
    const accounts = await web3.eth.getAccounts();
    console.log('App account eth: ', Number.parseFloat(await web3.eth.getBalance(accounts[0]) / 1e18).toFixed(2));
    shared.contract = new web3.eth.Contract(web3Config.abi, web3Config.contract_address, {
        from: accounts[0],
        gas: 3000000
    });

    shared.hash = (obj) => {
        const hash = crypto.createHash('sha256');
        return hash.update(JSON.stringify(obj)).digest('hex');
    };
}


module.exports = async () => {
    await initMongo();
    await initRedis();
    await initWeb3();
};
