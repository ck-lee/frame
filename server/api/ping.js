var Joi = require('joi');
var Hoek = require('hoek');
var AuthPlugin = require('../auth');
var Config = require('../../config');


exports.register = function (server, options, next) {

    options = Hoek.applyToDefaults({ basePath: '' }, options);

    server.route({
        method: 'GET',
        path: options.basePath + '/ping',
        config: {
            auth: {
                strategy: 'simple'
                //scope: 'admin'
            },
            validate: {
                query: {
                    username: Joi.string().token().lowercase(),
                    isActive: Joi.string(),
                    role: Joi.string(),
                    fields: Joi.string(),
                    sort: Joi.string().default('_id'),
                    limit: Joi.number().default(20),
                    page: Joi.number().default(1)
                }
            }
            /*pre: [
             AuthPlugin.preware.ensureAdminGroup('root')
             ]*/
        },
        handler: function (request, reply) {

            if (!request.auth.isAuthenticated){
                reply('pong');
            }else {
                var result = {};
                result.server = request.server.info;
                result.settings = request.server.settings;
                result.config = Config.get('/');
                reply(result);
            }
        }
    });


    next();
};


exports.register.attributes = {
    name: 'ping'
};
