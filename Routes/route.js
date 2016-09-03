"use strict";

const controllers = require('../Controllers');

const routeController = controllers.routeController;

const TAGS= ['api', 'endpoint', 'data'];

const util = require("../Utility/util");

const CONFIG = require('../Config');

const CONSTANT = CONFIG.CONSTANTS;

const ERROR_MESSAGES = CONSTANT.STATUS_MSG.ERROR;

const SUCCESS_MESSAGES = CONSTANT.STATUS_MSG.SUCCESS;

const STATUS_CODE = CONSTANT.STATUS_CODE;

const Joi = require('joi');


let importCSVIntoDB = {

    method: 'POST',

    path: '/api/v1/toppr/importCsvIntoJson',

    config: {

        description: 'Save CSV Data Into Mongo DB',

        tags: TAGS,

        payload: {
            maxBytes: 20715200,
            output: 'file',
            parse: true,
            allow: 'multipart/form-data'
        },

        handler:  (request, reply) => {

            routeController.importCSVIntoDB( request.payload, (error, success) => {
                if (error) {

                    reply(util.sendError(error));

                } else {

                    reply(util.sendSuccess(SUCCESS_MESSAGES.DEFAULT, success)).code(STATUS_CODE.OK);
                }
            });
        },
        validate: {

            payload: {

                csvFile: Joi.any().meta({swaggerType: 'file'}).required()

            },

            failAction: util.failActionFunction

        },
        plugins: {

            'hapi-swagger': {
                payloadType: 'file',
                responseMessages: CONSTANT.swaggerDefaultResponseMessages
            }

        }
    }
};

let listPlaces = {

    method: 'GET',

    path: '/api/toppr/list',

    config: {

        description: 'List Places',

        tags: TAGS,

        handler:  (request, reply) => {

            routeController.listPlaces( (error, success) => {
                if (error) {

                    reply(util.sendError(error));

                } else {
                    console.log("hit");

                    reply(util.sendSuccess(SUCCESS_MESSAGES.DEFAULT, success)).code(STATUS_CODE.OK);
                }
            });
        },
        validate: {

            failAction: util.failActionFunction

        },
        plugins: {

            'hapi-swagger': CONSTANT.SWAGGER_OPTIONS_JSON

        }
    }
};

let countData = {

    method: 'GET',

    path: '/api/toppr/count',

    config: {

        description: 'Count Data',

        tags: TAGS,

        handler:  (request, reply) => {

            routeController.countData( (error, success) => {
                if (error) {

                    reply(util.sendError(error));

                } else {

                    reply(util.sendSuccess(SUCCESS_MESSAGES.DEFAULT, success)).code(STATUS_CODE.OK);
                }
            });
        },
        validate: {

            failAction: util.failActionFunction

        },
        plugins: {

            'hapi-swagger': CONSTANT.SWAGGER_OPTIONS_JSON

        }
    }
};


let getStats = {

    method: 'GET',

    path: '/api/toppr/stats',

    config: {

        description: 'Get stats of Data',

        tags: TAGS,
        
        handler:  (request, reply) => {
            
            routeController.getStats( (error, success) => {
                if (error) {

                    reply(util.sendError(error));

                } else {

                    reply(util.sendSuccess(SUCCESS_MESSAGES.DEFAULT, success)).code(STATUS_CODE.OK);
                }
            });
        },
        validate: {

            failAction: util.failActionFunction

        },
        plugins: {

            'hapi-swagger': CONSTANT.SWAGGER_OPTIONS_JSON
            
        }
    }
};

let searchBy = {

    method: 'GET',

    path: '/api/toppr/search',

    config: {

        description: 'Get Data based on any parameters',

        tags: TAGS,

        handler:  (request, reply) => {

            routeController.searchBy( request.query, (error, success) => {
                if (error) {

                    reply(util.sendError(error));

                } else {

                    reply(util.sendSuccess(SUCCESS_MESSAGES.DEFAULT, success)).code(STATUS_CODE.OK);
                }
            });
        },
        validate: {

            query: {

                name: Joi.string().optional(),

                attackerKing: Joi.string().optional(),

                defenderKing: Joi.string().optional(),
                
                battleType: Joi.string().optional(),

                location: Joi.string().optional(),

                region: Joi.string().optional(),

                attackerCommander: Joi.string().optional(),

                defenderCommander: Joi.string().optional()

            },

            failAction: util.failActionFunction

        },
        plugins: {

            'hapi-swagger': CONSTANT.SWAGGER_OPTIONS_JSON

        }
    }
};

module.exports = [
    importCSVIntoDB,
    listPlaces,
    countData,
    //getStats,
    searchBy
];
