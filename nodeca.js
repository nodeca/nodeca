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
  try {
    nodeca.logger.warn('Uncaught exception');
    nodeca.logger.error(err.stack || err.message || err.toString());
  } catch (loggerError) {
    // THIS SHOULD NEVER-EVER-EVER HAPPEN -- THIS IS A WORST CASE SCENARIO
    // USAGE: ./nodeca.js 2>/var/log/nodeca-cf.log
    process.stderr.write('\nLogger failed write: ' + loggerError.stack);
    process.stderr.write('\nOriginal error happened: ' + (err.stack || err));
  }
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
