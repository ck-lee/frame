var Lab = require('lab');
var Code = require('code');
var Hapi = require('hapi');
var Config = require('../../config');

var lab = exports.lab = Lab.script();
var expect = Code.expect;


lab.experiment('Azure Service Bus Plugin halfway tests', { timeout: 60000 }, function () {

    var server;
    lab.beforeEach({ timeout: 60000 }, function (done) {

        var AzureServicePlugin = {
            register: require('../../lib/azureService'),
            options: {
                url: Config.get('/hapiAzureSB/url'),
                topicPath: 'fakeTopic',
                subscriptionPath: 'fakeSubscription'
            }
        };


        var plugins = [ AzureServicePlugin ];

        server = new Hapi.Server();
        server.connection({ port: Config.get('/port/web') });
        server.register(plugins, function (err) {

            if (err) {
                return done(err);
            }
            server.plugins.azureService.createTopicIfNotExists(function (err) {

                if (err) {
                    return done(err);
                }

                server.plugins.azureService.createSubscription(function (err) {

                    done();
                });
            });


        });

    });

    lab.test('it receivedSubscriptionMessage', { timeout: 60000 }, function (done) {

        var message = {
            body: 'woohoo',
            customProperties: {test: 123}
        };


        server.plugins.azureService.startReceiveSubscriptionMessage(function (lockedMessage, receiveMessageCallbackDone) {

            expect(lockedMessage.body).to.equal(message.body);
            expect(lockedMessage.customProperties.test).to.equal(message.customProperties.test);
            receiveMessageCallbackDone();
            done();
        });


        server.plugins.azureService.sendTopicMessage(message, function (err) {


        });
    });

});

