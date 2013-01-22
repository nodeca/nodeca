#!/usr/bin/env node


"use strict";

Error.stackTraceLimit = 30;

exports.root = __dirname;

// Executed once all application were loaded.
// Used to "attach" hooks for models etc.
/* exports.init = function (N) {}; */

if (!module.parent) {
  require('nodeca.core/lib/system/runner').bootstrap(exports);
}
