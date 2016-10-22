#!/usr/bin/env node
'use strict';


Error.stackTraceLimit = 30;
require('any-promise/register/bluebird');


exports.root = __dirname;

if (!module.parent) {
  require('nodeca.core').run(exports);
}
