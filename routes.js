// Description: Application Routes

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    notFoundHandler : notFoundHandler,
    user : userHandler
};

module.exports = routes;