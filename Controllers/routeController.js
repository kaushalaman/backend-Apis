"use strict";

const async = require('async');

const util = require("../Utility/util");

const CONFIG = require('../Config');

const CONSTANT = CONFIG.CONSTANTS;

const ERROR_MESSAGES = CONSTANT.STATUS_MSG.ERROR;

const SUCCESS_MESSAGES = CONSTANT.STATUS_MSG.SUCCESS;

const mime = require('mime');

const MongoClient = require('mongodb').MongoClient;

const local = "mongodb://localhost/toppr";

const __ = require("underscore");

const mongodbURI = {
    local: local
};

let mongoURI = mongodbURI.local;

let importCSVIntoDB = (payload, callbackRoute) => {

    let fileName;

    let filePath;

    let type;

    let DOCUMENTS_TYPE = ["text/csv"];

    let jsonData;
    let finalJsonData = [];

    let cols;

    let returnedData = {};

    async.auto({

        documentType: (callback) => {

            fileName = payload.csvFile.filename;

            type = mime.lookup(fileName);


            if (DOCUMENTS_TYPE.indexOf(type) == -1) {

                return callback(ERROR_MESSAGES.SUPPORTED_DOCUMENT_TYPES);
            }

            returnedData.fileName = fileName;

            returnedData.fileType = type;

            filePath = payload.csvFile.path;

            return callback(null, filePath);


        },

        convertCSVIntoJSON: ['documentType', (results, callback) => {

            util.getJsonFromCSVFile(filePath, callback);

        }],

        buildData: ['convertCSVIntoJSON', (results, callback) => {

            jsonData = results.convertCSVIntoJSON;

            if (jsonData.length > 0) {

                jsonData.forEach((object) => {

                    console.log(object);

                    cols = util.getKeys(object);

                    let tempObj = {};

                    cols.forEach((key) => {

                        if (object[key] === "") {
                            tempObj[key] = null;
                        }
                        else {
                            tempObj[key] = object[key];
                        }
                    });

                    finalJsonData.push(tempObj);

                    returnedData.jsonData = finalJsonData;

                    returnedData.count = finalJsonData.length;

                });

                return callback(null, finalJsonData);
            }
            else {

                return callback(ERROR_MESSAGES.EMPTY_CSV_FILE);
            }
        }],

        saveData: ['buildData', (results, callback) => {

            MongoClient.connect(mongoURI, (error, db) => {

                if (error) {

                    console.log("DB Error: ", error);

                    process.exit(1);
                } else {

                    console.log('MongoDB Connected at', mongoURI);

                    db.collection('battle').insertMany(finalJsonData, (error, data) => {

                        if (error) return callback(error);

                        else {

                            db.close();

                            return callback(null);
                        }

                    });
                }
            });

        }]

    }, (error, data) => {
        if (error) {
            return callbackRoute(error);
        }
        return callbackRoute(null, returnedData);
    });
};

let getJSONFromCSV = (payload, callbackRoute) => {

    let fileName;

    let filePath;

    let type;

    let DOCUMENTS_TYPE = ["text/csv"];

    let jsonData;
    let finalJsonData = [];

    let cols;

    let returnedData = {};

    async.auto({

        documentType: (callback) => {

            fileName = payload.csvFile.filename;

            type = mime.lookup(fileName);


            if (DOCUMENTS_TYPE.indexOf(type) == -1) {

                return callback(ERROR_MESSAGES.SUPPORTED_DOCUMENT_TYPES);
            }

            returnedData.fileName = fileName;

            returnedData.fileType = type;

            filePath = payload.csvFile.path;

            return callback(null, filePath);


        },

        convertCSVIntoJSON: ['documentType', (results, callback) => {

            util.getJsonFromCSVFile(filePath, callback);

        }],

        buildData: ['convertCSVIntoJSON', (results, callback) => {

            jsonData = results.convertCSVIntoJSON;

            if (jsonData.length > 0) {

                jsonData.forEach((object) => {

                    console.log(object);

                    cols = util.getKeys(object);

                    let tempObj = {};

                    cols.forEach((key) => {

                        if (object[key] === "") {
                            tempObj[key] = null;
                        }
                        else {
                            tempObj[key] = object[key];
                        }
                    });

                    finalJsonData.push(tempObj);

                    returnedData.jsonData = finalJsonData;

                    returnedData.count = finalJsonData.length;

                });

                return callback(null);
            }
            else {

                return callback(ERROR_MESSAGES.EMPTY_CSV_FILE);
            }
        }]

    }, (error, data) => {
        if (error) {
            return callbackRoute(error);
        }
        return callbackRoute(null, returnedData);
    });
};

let listPlaces = (callbackRoute) => {

    let returnedData = [];


    async.auto({

        getDistinctBattlePlaces: (callback) => {

            MongoClient.connect(mongoURI, (error, db) => {

                if (error) {

                    console.log("DB Error: ", error);

                    process.exit(1);
                } else {

                    console.log('MongoDB Connected at', mongoURI);

                    let query = [
                        {
                            $group: {
                                _id: {
                                    location: '$location',
                                    region: "$region"
                                }
                            }
                        }
                    ];

                    db.collection('battle').aggregate(query).toArray((error, data) => {

                        if (error) return callback(error);

                        else {

                            db.close();

                            returnedData = data;

                            //returnedData.push({count: data.length});

                            return callback(null, returnedData);
                        }

                    });
                }
            });

        },

        returnedData: ['getDistinctBattlePlaces', (results, callback) => {

            let returnedFinalData = __.pluck(returnedData, '_id');

            returnedFinalData.push({count: returnedFinalData.length});

            return callback(null, returnedFinalData);

        }]

    }, (error, data) => {

        if (error) {

            return callbackRoute(error);
        }
        else {

            return callbackRoute(null, data.returnedData);
        }
    });
};

let countData = (callbackRoute) => {

    async.series({

        "count": (callback) => {

            MongoClient.connect(mongoURI, (error, db) => {

                if (error) {

                    console.log("DB Error: ", error);

                    process.exit(1);
                } else {

                    console.log('MongoDB Connected at', mongoURI);

                    db.collection('battle').count((error, data) => {

                        if (error) return callback(error);

                        else {

                            db.close();

                            return callback(null, data);
                        }

                    });
                }
            });
        }

    }, (error, data) => {

        if (error) {
            return callbackRoute(error);
        }
        else {
            return callbackRoute(null, data);
        }

    });
};

let getStats = (callbackRoute) => {

};

let searchBy = (query, callbackRoute) => {

    let criteria = {};

    let returnedData;

    async.auto({

        makeQuery: (callback) => {

            if (query.name) criteria.name = query.name;

            if (query.attackerKing) criteria.attacker_king = util.toTitleCase(query.attackerKing);

            if (query.defenderKing) criteria.defender_king = util.toTitleCase(query.defenderKing);

            if (query.battleType) criteria.battle_type = query.battleType;

            if (query.location) criteria.location = util.toTitleCase(query.location);

            if (query.region) criteria.region = util.toTitleCase(query.region);

            if (query.attackerCommander) criteria.attacker_commander = util.toTitleCase(query.attackerCommander);

            if (query.defenderCommander) criteria.defender_commander = util.toTitleCase(query.defenderCommander);


            console.log("query", criteria);

            if(__.isEmpty(criteria)){
                return callback(ERROR_MESSAGES.NO_PARAMETERS);
            }
            else{
                return callback(null, criteria);
            }           

        },

        getData: ['makeQuery', (results, callback) => {

            MongoClient.connect(mongoURI, (error, db) => {

                if (error) {

                    console.log("DB Error: ", error);

                    process.exit(1);
                } else {

                    console.log('MongoDB Connected at', mongoURI);

                    db.collection('battle').find(criteria).toArray((error, data) => {

                        if (error) return callback(error);

                        else {

                            db.close();
                            
                            if(data.length > 0){

                                returnedData = data;


                                returnedData.push({count: data.length});

                                return callback(null, returnedData);
                            }
                            else{
                                return callback(ERROR_MESSAGES.NO_SUCH_BATTLE);
                            }                            
                        }

                    });
                }
            });

        }]


    }, (error, data) => {
        if (error) {
            return callbackRoute(error);
        }
        else {
            return callbackRoute(null, data.getData);
        }
    });

};

module.exports = {
    importCSVIntoDB,
    getJSONFromCSV,
    listPlaces,
    countData,
    //getStats,
    searchBy
};