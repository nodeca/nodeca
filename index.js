var path = require('path'),
    fs = require('fs'),
    express = require('express'),
    nodeca = require('nodeca-lib'),
    Promise = nodeca.Promise,
    $$ = nodeca.Utilities,
    app = new nodeca.Application(__dirname, ['application.yml']);


// Outputs error to stderr and terminates process with given code
var halt = function halt(err, code) {
  console.error(err.stack.toString());
  process.exit(code || 1);
};


// error codes
var ERR_INIT    = 128;
var ERR_START   = 129;


// initialize application
app.init(function (err, app, config) {
  if (err) {
    halt(err, ERR_INIT);
  }

  try {
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
    // TODO: Replace with nodeca.I18n.middleware ?
    server.use(function injectTranslator(req, res, next) {
      res.local('__', function __(str) {
        return str;
      });
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

    // init sub-apps
    $$.iterate(config.modules || {}, function next(mod_name, mod_config, next) {
      app.mount(mod_name, mod_config, function (err) {
        if (err) {
          halt(err, ERR_INIT);
        }
        next();
      });
    }, function final(err) {
      if (err) {
        halt(err, ERR_INIT);
      }

      // inject routes
      app.router.inject(server);

      // register heplers
      server.helpers({
        config: function (section) { return config[section]; }
      });

      // start server
      var listen = $$.deepMerge({port: 8000}, config.listen);
      server.listen(listen.port, listen.host);
    });
  } catch (err) {
    halt(err, ERR_START);
  }
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
