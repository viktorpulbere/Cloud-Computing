'use strict';
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const config = require('./../config').oidc;

module.exports = jwt({
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.jwksUri
    }),

    // Validate the audience and the issuer.
    audience: config.audience,
    issuer: config.issuer,
    algorithms: ['RS256']
});

// module.exports = (req, res, next) => {
//     // req.id = '5e7f62902bcf9b72e8d0a11e'
//     req.user = {email: 'andreimardare02@gmail.com'};
//     next();
// };
