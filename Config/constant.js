"use strict";

const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    DO_NOT_PROCESS: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_FAILURE: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    ALREADY_EXISTS_CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,
    SERVER_ERROR: 500
};

let STATUS_MSG = {

    ERROR: {

        EMPTY_CSV_FILE: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'Empty CSV File',
            type: 'EMPTY_CSV_FILE'
        },

        DB_ERROR: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'DB Error : ',
            type: 'DB_ERROR'
        },

        INVALID_OBJECT_ID: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'Invalid Object ID',
            type: 'INVALID_OBJECT_ID'
        },

        DUPLICATE: {
            statusCode: STATUS_CODE.ALREADY_EXISTS_CONFLICT,
            customMessage: 'Duplicate Entry',
            type: 'DUPLICATE'
        },

        APP_ERROR: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'Application Error',
            type: 'APP_ERROR'
        },

        ACCESS_DENIED: {
            statusCode: STATUS_CODE.FORBIDDEN,
            customMessage: 'Access Denied',
            type: 'APP_ERROR'
        },

        SUPPORTED_DOCUMENT_TYPES: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'Supported documents type is csv',
            type: 'SUPPORTED_DOCUMENT_TYPES'
        },

        NO_PARAMETERS: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'No parameters',
            type: 'NO_PARAMETERS'
        },

        NO_SUCH_BATTLE: {
            statusCode: STATUS_CODE.BAD_REQUEST,
            customMessage: 'No Such battle Data',
            type: 'NO_SUCH_BATTLE'
        }

    },

    SUCCESS: {

        DEFAULT: {
            statusCode: STATUS_CODE.OK,
            customMessage: 'Success',
            type: 'DEFAULT'
        },

        DATA_IMPORT_DB: {
            statusCode: STATUS_CODE.CREATED,
            customMessage: 'Successfully CSV Data imported in Mongo DB',
            type: 'DATA_IMPORT_DB'
        }
    }

};

let swaggerDefaultResponseMessages = [

    {code: 201, message: 'Created'},

    {code: 400, message: 'Bad Request'},

    {code: 401, message: 'Unauthorized'},

    {code: 404, message: 'Data Not Found'},

    {code: 500, message: 'Internal Server Error'},

    {code: 409, message: 'Duplicate Database Entry'}
];

const PAYLOAD_TYPE = {
    FORM: 'form',
    JSON: 'json',
    FILE: 'file'
};

const SWAGGER_OPTIONS_JSON = {

    payloadType: PAYLOAD_TYPE.JSON,

    responseMessages: swaggerDefaultResponseMessages
};

const SWAGGER_OPTIONS_FILE = {

    payloadType: PAYLOAD_TYPE.FILE,

    responseMessages: swaggerDefaultResponseMessages
};

module.exports = {
    STATUS_CODE,
    STATUS_MSG,
    swaggerDefaultResponseMessages,
    PAYLOAD_TYPE,
    SWAGGER_OPTIONS_JSON,
    SWAGGER_OPTIONS_FILE
};