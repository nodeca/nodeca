#!/usr/bin/env node

/*global nodeca*/

'use strict';

// Create and run app
var app = require('nlib').Application.create({
  name: 'nodeca',
  root: __dirname
});

//
// Preset application version
//


nodeca.runtime.version = require('./package.json').version;


//
// Catch unexpected exceptions
//


process.on('uncaughtException', function (err) {
  nodeca.logger.warn('Uncaught exception');
  nodeca.logger.error(err.stack || err.message || err.toString());
});


//
// Run application
//


app.run();
