#!/usr/bin/env node


'use strict';

Error.stackTraceLimit = 30;

exports.root = __dirname;

// Executed once all application were loaded.
// Used to "attach" hooks for models etc.
/* exports.init = function (N) {}; */

// disable orc at runtime to avoid segfaults,
// see https://github.com/lovell/sharp/issues/172#issuecomment-162800414
process.env.VIPS_NOVECTOR = 1;

if (!module.parent) {
  require('nodeca.core/lib/system/runner').bootstrap(exports);
}
