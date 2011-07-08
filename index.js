var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    nodeca = require('nodeca-lib'),
    Promise = nodeca.Promise,
    $$ = nodeca.Utilities;


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


var app, // Application instance
    cfg; // Application config


// initialize application
try {
  app = new nodeca.Application(__dirname, function bootstrapper() {
    this.addHook('schemas-loaded', function () {
      this.log.debug("Schemas were loaded! Cool!");
    });
  });

  cfg = app.readConfig('application', app.env);
  
  app.init(cfg);
} catch (err) {
  // we need to have some logger available before init, to be able write errors
  // upon init stage (for example when application is managed by cluster).
  halt(err, ERR_START);
}


// application is ready to start
app.ready(function (err) {
  if (err) {
    // spmething went wrong during app initializtion
    halt(err, ERR_START);
    return;
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

  server.helpers({
    // basically we can get req and res from `this` afaik
    __: function __(str, params, context) { return str; }
  });

  server.use(server.router);

  // last handler starts new cycle with error
  server.use(function RouteNotFound(req, res, next) {
    var err  = new Error('Not Found');
    err.code = 404;
    return next(err);
  });

  // register rerror handler should be configured
  server.error(function(err, req, res, next) {
    app.log.error(err, req).error(err.stack);

    req.originalController  = req.controller;
    req.originalAction      = req.action;
    req.controller          = 'errors';
    req.action              = 'error';
    req.error               = err;

    app.dispatcher.dispatch(req, res, next);
  });


  // start server
  var listen = $$.merge({port: 8000}, app.config.listen);
  server.listen(listen.port, listen.host);
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
