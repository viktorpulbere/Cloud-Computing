'use strict';

const { MongoClient } = require('mongodb');
const { mongo } = require('../config');
const shared = require('../utils/serviceVars');

async function initMongo() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongo.url, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.error(err.message);

                return reject(err);
            }
    
            console.log("Connected successfully to mongo server");
            shared.mongo = {};
    
            const db = client.db(mongo.db);

            Object.keys(mongo.collections).forEach(collectionName => {
                shared.mongo[collectionName] = db.collection(mongo.collections[collectionName]);
            });
    
            resolve();
        });
    });
}

module.exports = async () => {
    await initMongo();
};