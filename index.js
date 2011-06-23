var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    nodeca = require('nodeca-lib'),
    Promise = nodeca.Promise,
    $$ = nodeca.Utilities,
    configFile = path.join(app.dirname, 'config', 'application.yml');


// Outputs error to stderr and terminates process with given code
var halt = function halt(err, code) {
  console.error(err.stack.toString());
  process.exit(code || 1);
};


// register unexpected exceptions handler
process.on('uncaughtException', function(err) {
  console.log('!!! UNCAUGHT EXCEPTION !!!');
  halt(err);
});


// error codes
var ERR_INIT    = 128;
var ERR_START   = 129;


// initialize application
try {
  var app = new nodeca.Application(__dirname, function bootstrapper() {
    this.addHook('schemas-loaded', function () {
      this.log("Schemas were loaded! Cool!");
    });
  }).init($$.readYamlSync(configFile, true));
} catch (err) {
  // we need to have some logger available before init, to be able write errors
  // upon init stage (for example when application is managed by cluster).
  halt(err, ERR_START);
}


// create server and run it
var server = express.createServer();

// set view engine and some default options
server.set('view engine', 'jade');
server.set('view options', {layout: 'layouts/default'});

// set request handlers chain
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.bodyParser());
server.use(express.methodOverride());
server.use(express.cookieParser());

server.helper('__', function __(str, params, context) {
  // basically we can get req and res from `this` afaik
  return str;
});

server.use(server.router);

// last handler starts new cycle with error
server.use(function RouteNotFound(req, res, next) {
  var err  = new Error('Not Found');
  err.code = 404;
  return next(err);
});

// register rerror handler should be configured
server.error((function (dispatcher) {
  var controller = 'errors';
  var action     = 'error';

  if (!dispatcher.isDispatchable({"controller": controller, "action": action})) {
    return function (err, req, res, next) {
      res.send(err);
    }
  }

  return function(err, req, res, next) {
    logger.error(err, req);
    logger.debug(err.stack);

    req.originalController  = req.controller;
    req.originalAction      = req.action;
    req.controller          = controller;
    req.action              = action;
    req.error               = err;

    dispatcher.dispatch(req, res, next);
  }
})(app.dispatcher));


// start server
var listen = $$.deepMerge({port: 8000}, app.config.listen);
server.listen(listen.port, listen.host);


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
