/// <reference path="../typings/node-azure/azure.d.ts"/>

var Async = require('async');
var Joi = require('joi');
var Hoek = require('hoek');
var azure = require('azure');

exports.register = function (server, options, next) {

    Hoek.assert(options.url, 'options.url is required');
    Hoek.assert(options.topicPath, 'options.topicPath is required');
    Hoek.assert(options.subscriptionPath, 'options.subscriptionPath is required');

    var serviceBusService = azure.createServiceBusService(options.url);

    var startReceiveSubscriptionMessage = function (receiveMessageCallback, errback) {

        Async.forever(function (foreverNext) {

            Async.auto({
                message: function (done) {

                    serviceBusService.receiveSubscriptionMessage(options.topicPath, options.subscriptionPath, { isPeekLock: true },

                        function (error, lockedMessage) {

                            if (error) {
                                done(error);
                            }
                            else {
                                done(null, lockedMessage);
                            }
                        }
                    );

                },
                log: ['message', function (done, results) {

                    done();
                }],
                receiveMessageCallback: ['message', function (done, results){

                    receiveMessageCallback(results.message, done);
                }],
                delete: ['receiveMessageCallback', function (done, results) {

                    serviceBusService.deleteMessage(results.message, function (error) {

                        done(error);
                    });
                }]
            }, function () {

                foreverNext();
            });
        }, function (err){

            errback(err);
        });
    };

    server.expose('startReceiveSubscriptionMessage', startReceiveSubscriptionMessage);

    server.expose('createSubscription', function (callback){

        serviceBusService.createSubscription(options.topicPath, options.subscriptionPath, callback);
    });

    server.expose('createTopicIfNotExists', function (callback){

        serviceBusService.createTopicIfNotExists(options.topicPath, callback);
    });

    server.expose('sendTopicMessage', function (message, callback){

        serviceBusService.sendTopicMessage(options.topicPath, message, callback);
    });

    server.expose('serviceBusService', serviceBusService);

    next();
};


exports.register.attributes = {
    name: 'azureService'
};
