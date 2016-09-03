'use strict';

//Register Swagger
let pack = require('../package'),
    swaggerOptions = {
        info: {
            title: 'Toppr Backend Contest Documentation',
            version: pack.version
        },
        pathPrefixSize: 3
    };

exports.register =  (server, options, next) => {

    server.register({
        
        register: require('hapi-swagger'),
        options: swaggerOptions
        
    }, (error) => {
        
        if (error) {
            
            server.log(['error'], 'hapi-swagger load error: ' + error);
            
        } else {
            server.log(['start'], 'hapi-swagger interface loaded')
        }
    });

    next();
};

exports.register.attributes = {
    name: 'swagger-plugin'
};