//var csv is the CSV file with headers
"use strict";

const fs = require("fs");

const Converter = require("csvtojson").Converter;

const converter = new Converter({});

const Boom = require('boom');

const CONFIG = require('../Config');

const CONSTANT = CONFIG.CONSTANTS;

const ERROR_MESSAGES = CONSTANT.STATUS_MSG.ERROR;

const SUCCESS_MESSAGES = CONSTANT.STATUS_MSG.SUCCESS;

const STATUS_CODE = CONSTANT.STATUS_CODE;

let getJsonFromCSVFile = (csvFile, callback) => {

    let jsonData;

    converter.fromFile(csvFile, (error, result)=> {

        if(error){

            return callback(error);

        }
        if(result.length > 0){

            //console.log("results", result);

            return callback(null, result);

        }
        else{

            return callback(ERROR_MESSAGES.EMPTY_CSV_FILE);

        }
    });

};

let sendError =  (data) => {

    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {

        return Boom.create(data.statusCode, data.customMessage);

    } else {

        console.log("ERR::", data.name);

        let errorToSend = '';

        if (typeof data == 'object') {

            if (data.name == 'MongoError') {

                errorToSend += ERROR_MESSAGES.DB_ERROR.customMessage;

                if (data.code = 11000) {

                    errorToSend += ERROR_MESSAGES.DUPLICATE.customMessage;

                }

            } else if (data.name == 'ApplicationError') {

                errorToSend += ERROR_MESSAGES.APP_ERROR.customMessage;

            } else if (data.name == 'ValidationError') {

                errorToSend += ERROR_MESSAGES.APP_ERROR.customMessage + data.message;

            } else if (data.name == 'CastError') {

                errorToSend += ERROR_MESSAGES.customMessage + ERROR_MESSAGES.INVALID_OBJECT_ID.customMessage;

            }
        } else {

            errorToSend = data;

        }
        let customErrorMessage = errorToSend;

        if (typeof errorToSend == 'string') {

            if (errorToSend.indexOf("[") > -1) {

                customErrorMessage = errorToSend.substr(errorToSend.indexOf("["));

            } else {

                customErrorMessage = errorToSend;

            }

            customErrorMessage = customErrorMessage.replace(/"/g, '');

            customErrorMessage = customErrorMessage.replace('[', '');

            customErrorMessage = customErrorMessage.replace(']', '');
        }
        return Boom.create(400, customErrorMessage)
    }
};

let sendSuccess =  (successMsg, data) => {

    successMsg = successMsg || SUCCESS_MESSAGES.DEFAULT.customMessage;

    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {

        return {statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || {}};

    } else {
        return {statusCode: 200, message: successMsg, data: data || {}};

    }
};

let failActionFunction = (request, reply, source, error) => {

    if (error.isBoom) {

        delete error.output.payload.validation;
        delete error.output.payload.error;
        delete error.output.payload.statusCode;

        if (error.output.payload.message.indexOf("authorization") !== -1) {

            error.output.statusCode = STATUS_CODE.UNAUTHORIZED;

            error.output.payload.message = ERROR_MESSAGES.ACCESS_DENIED;

            error.output.payload.data = {};

            return reply(error);
        }

        let details = error.data.details[0];

        if (details.message.indexOf("pattern") > -1 && details.message.indexOf("required") > -1 && details.message.indexOf("fails") > -1) {

            error.output.payload.message = "Invalid " + details.path;

            return reply(error);
        }
    }

    let customErrorMessage = '';

    if (error.output.payload.message.indexOf("[") > -1) {

        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));

    } else {

        customErrorMessage = error.output.payload.message;

    }

    customErrorMessage = customErrorMessage.replace(/"/g, '');

    customErrorMessage = customErrorMessage.replace('[', '');

    customErrorMessage = customErrorMessage.replace(']', '');

    error.output.payload.message = customErrorMessage;

    error.output.payload.data = {};

    delete error.output.payload.validation;
    delete error.output.payload.error;
    delete error.output.payload.statusCode;
    
    return reply(error);
};

let getKeys = (object) => {

    let keys = [];

    for(let i in object) keys.push(i);

    return keys;
};

let capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

let toTitleCase = (string) =>{

    return string.replace(/\w\S*/g, (text) => {return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();});
};

module.exports = {

    getJsonFromCSVFile,
    sendError,
    sendSuccess,
    failActionFunction,
    getKeys,
    capitalizeFirstLetter,
    toTitleCase

};



