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
// Handle SIGnals
//


function shutdown_gracefully() {
  nodeca.logger.info('Shutting down...');
  process.exit(0);
}


// shutdown gracefully on SIGTERM :
process.on('SIGTERM', shutdown_gracefully);
process.on('SIGINT',  shutdown_gracefully);


//
// Run application
//


app.run();
