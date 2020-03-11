'use strict';

const axios = require('axios');

(async () => {
    let batch = [];
    
    for (let i = 0; i < 10; i++) {
        batch.push(axios.get('http://localhost:3000/api/v1?place=Iasi&tag=restaurant'));
    }
    
    try {
        await Promise.all(batch);
    } catch (err) {
        console.log(err);
    }
})();