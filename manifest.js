var Confidence = require('confidence');
var Config = require('./config');


var criteria = {
    env: process.env.NODE_ENV
};


var manifest = {
    $meta: 'This file defines the plot device.',
    server: {
        debug: {
            request: ['error']
        },
        connections: {
            routes: {
                security: true
            }
        }
    },
    connections: [{
        port: Config.get('/port/web'),
        labels: ['web']
    }],
    plugins: {
        'hapi-auth-basic': {},
        'lout': {},
        'visionary': {
            engines: { jade: 'jade' },
            path: './server/web'
        },
        'hapi-mongo-models': {
            mongodb: Config.get('/hapiMongoModels/mongodb'),
            models: {
                Account: './server/models/account',
                AdminGroup: './server/models/admin-group',
                Admin: './server/models/admin',
                AuthAttempt: './server/models/auth-attempt',
                Session: './server/models/session',
                Status: './server/models/status',
                User: './server/models/user'
            },
            autoIndex: Config.get('/hapiMongoModels/autoIndex')
        },
        './server/auth': {},
        './server/mailer': {},
        './server/api/accounts': { basePath: '/api/v1' },
        './server/api/admin-groups': { basePath: '/api/v1' },
        './server/api/admins': { basePath: '/api/v1' },
        './server/api/auth-attempts': { basePath: '/api/v1' },
        './server/api/contact': { basePath: '/api/v1' },
        './server/api/index': { basePath: '/api/v1' },
        './server/api/login': { basePath: '/api/v1' },
        './server/api/logout': { basePath: '/api/v1' },
        './server/api/sessions': { basePath: '/api/v1' },
        './server/api/signup': { basePath: '/api/v1' },
        './server/api/statuses': { basePath: '/api/v1' },
        './server/api/users': { basePath: '/api/v1' },
        './server/api/ping': { basePath: '/api/v1' },
        './server/web/index': {}
    }
};


var store = new Confidence.Store(manifest);


exports.get = function (key) {

    return store.get(key, criteria);
};


exports.meta = function (key) {

    return store.meta(key, criteria);
};
