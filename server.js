/**
 * Created by Aman Kaushal on 03/09/16.
 */


'use strict';

const Hapi = require('hapi'),
    config = require('./Config'),
    Plugins = require('./Plugins'),
    Routes = require('./Routes'),
    log4js = require('log4js'),
    server = new Hapi.Server();


let connectionOptions = {

    port: process.env.PORT,

    host: config.serverConfig.HOST,

    routes: {
        cors: true
    }
};

server.connection(connectionOptions);

// Plugin register in server
server.register(Plugins, (error) => {

    if (error) {

        server.error('Error while loading Plugins : ' + error);

    } else {

        server.log('info', 'Plugins Loaded');

    }

});

Routes.forEach((api) => {

    console.log("api", api);

    server.route(api);

});

//Adding Views

server.views({

    engines: {

        html: require('handlebars')

    },

    relativeTo: __dirname,

    path: './Views'
});


// Start Server
server.start((error) => {

    if (error) {

        throw error;

    }
    else {
        console.log('Server running at:', server.info.uri);

        server.log('Server running at:', server.info.uri);
    }


});