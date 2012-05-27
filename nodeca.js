#!/usr/bin/env node

/*global nodeca*/

'use strict';

// Create and run app
var app = require('nlib').Application.create({
  name: 'nodeca',
  root: __dirname
});

nodeca.runtime.version = require('./package.json').version;

app.run();
