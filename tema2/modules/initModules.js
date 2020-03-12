'use strict';

const { MongoClient } = require('mongodb');
const { mongo } = require('../config');
const shared = require('../utils/serviceVars');

async function initMongo() {
    const client = await MongoClient.connect(mongo.url, { useUnifiedTopology: true });

    console.log("Connected successfully to mongo server");
    shared.mongo = {};

    const db = client.db(mongo.db);

    Object.keys(mongo.collections).forEach(collectionName => {
        shared.mongo[collectionName] = db.collection(mongo.collections[collectionName]);
    });

    await db.collection('users').createIndex({ email: 1 }, { sparse: true, unique: true });
}

module.exports = async () => {
    await initMongo();
};