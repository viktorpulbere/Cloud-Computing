'use strict';

const { 
    LOCATION_ENDPOINT, 
    PIXABAY_ENDPOINT,
    NEARBY_ENDPOINT
} = require('./constants');
const axios = require('axios');
const log = require('./log');

axios.default.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date()}
    return config;
}, (err) => {
    return Promise.reject(err);
});

axios.default.interceptors.response.use((response) => {
    log(response);
    return response;
}, (err) => {
    log(err.response);
    return Promise.reject(err);
});

async function getPlaceDetails(place) {
    const { data: details } = await axios.get(`${LOCATION_ENDPOINT}?key=${process.env.LOCATION_ACCESS_KEY}&q=${place}&format=json`);

    return details.length ? details[0] : null;
}

async function getNearbyPlaces({ lon, lat }, tag) {
    const { data: places } = await axios.get(`${NEARBY_ENDPOINT}?key=${process.env.LOCATION_ACCESS_KEY}&lat=${lat}&lon=${lon}&tag=${tag}&radius=5000&format=json`);

    return places.length ? places : [];
}

async function getRandomImage(tag) {
    const { data } = await axios.get(`${PIXABAY_ENDPOINT}?key=${process.env.PIXABAY_KEY}&q=${tag}`);
    const { hits } = data;
    const randNumber = Math.floor(Math.random() * hits.length);
    const { previewURL, webformatURL = null } = hits[randNumber];

    return webformatURL ? webformatURL : previewURL;
}

module.exports = {
    getPlaceDetails,
    getNearbyPlaces,
    getRandomImage
};