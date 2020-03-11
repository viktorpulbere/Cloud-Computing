'use strict';

const express = require('express');
const router = express.Router();
const { 
    getNearbyPlaces,
    getPlaceDetails,
    getRandomImage
} = require('../../util/service_calls');
 
router.get('/', async (req, res) => {
    const { place, tag } = req.query;

    try {
        const placeDetails = await getPlaceDetails(place);

        if (!placeDetails) {
            res.statusCode = 404;
            return res.json({
                code: 1001,
                data: {
                    message: 'Place not found' 
                }
            });
        }

        const placeD = {
            displayName: placeDetails.display_name,
            type: placeDetails.type
        };

        const [
            nearbyPlaces,
            randomImage
        ] = await Promise.all([
            getNearbyPlaces(placeDetails, tag),
            getRandomImage(tag)
        ]);
    
        res.json({ 
            nearbyPlaces, 
            randomImage, 
            placeDetails: placeD
        });
    } catch (err) {
        res.statusCode = err.response && err.response.status ? err.response.status : 500;
        res.json({
            code: 1002,
            data: err.data || {
                message: 'Internal Server Error'
            }
        });
    }
});

module.exports = router;