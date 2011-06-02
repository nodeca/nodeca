var path = require('path'),
    fs = require('fs'),
    yaml = require('yaml'),
    express = require('express'),
    railer = require('express-railer'),
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
        throw new Error('errors#error controller or action not found');
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
    var modules = config.modules || {},
        mod_names = Object.getOwnPropertyNames(modules),
        initApps = function initApps(i, l) {
          if (i >= l) { // all modules were loaded
            // inject routes
            app.router.inject(server);

            // register heplers
            server.helpers({
              config: function (section) { return config[section]; }
            });

            // start server
            var listen = $$.deepMerge({port: 8000}, config.listen);
            server.listen(listen.port, listen.host);
            return;
          }

          app.mount(mod_names[i], modules[mod_names[i]], function (err) {
            if (err) {
              halt(err, ERR_INIT);
            }

            initApps(i + 1, l);
          });
        };

    initApps(0, mod_names.length);
  } catch (err) {
    halt(err, ERR_START);
  }
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
