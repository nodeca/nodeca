#!/usr/bin/env node


"use strict";


exports.root = __dirname;
exports.init = function () {
  // Executed once all application were loaded.
  // Used to "attach" hooks for models etc.
};


if (!module.parent) {
  require('nodeca.core/lib/system/runner').bootstrap(exports);
}
