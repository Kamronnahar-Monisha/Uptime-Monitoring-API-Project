// Description: Application Routes

// dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { notFoundHandler } = require('./handlers/routeHandlers/notFoundHandler');

const routes = {
    sample: sampleHandler,
    notFoundHandler : notFoundHandler
};

module.exports = routes;