'use strict';

var NodecaLib = require('nodeca-lib');

// Create application instance
var app = new NodecaLib.Application({name: 'nodeca', root: __dirname});

// run application
app.run();
