'use strict';

const Inert = require('inert'),
    Vision = require('vision');

module.exports = [
    Inert,
    Vision,
    {register: require('./swagger')},
    {register: require('./good-console')}
];