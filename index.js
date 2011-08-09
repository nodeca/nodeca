// base requirements
var nodeca = require('nodeca-lib');


// some base modules
var Promise = nodeca.SimplePromise,
    Express = nodeca.Express,
    $$ = nodeca.Utilities;


// main application context
var app = new nodeca.Application(__dirname),
    server = Express.createServer(),
    starter = $$.waterfall();


// register unexpected exceptions handler
process.on('uncaughtException', function(err) {
  console.log('UNHANDLED EXCEPTION: ' + err.message);
  console.error(err.stack);
});


// read application config
starter.queue(function (next) {
  var self = this;

  app.readConfig('application', app.env, function (err, config) {
    if (err) {
      next(err);
      return;
    }

    self.config = config;
    next();
  });
});


// init applications
starter.queue(function (next) {
  app.init(this.config, next);
});


// get logger
starter.queue(function (next) {
  var self = this;

  app.getLogger(function (err, logger) {
    if (err) {
      next(err);
      return;
    }

    self.logger = logger;
    next();
  });
});


// get dispatcher
starter.queue(function (next) {
  var self = this;

  app.getDispatcher(function (err, dispatcher) {
    if (err) {
      next(err);
      return;
    }

    self.dispatcher = dispatcher;
    next();
  });
});


// get public/ static lulz
starter.queue(function (next) {
  var self = this;

  app.getStatcLulz(function (err, lulz) {
    if (err) {
      next(err);
      return;
    }

    self.lulz = lulz;
    next();
  });
});


// prepare server
starter.queue(function (next) {
  app.getAllViews(function (err, dir, files) {
    if (err) {
      next(err);
      return;
    }

    server.set('views', dir);
    server.set('view cache', true);
    server.set('view engine', 'jade');
    server.set('view options', {layout: 'layouts/default'});

    // 1. need to render all views
    /* then uncomment following:
    delete Express.View.prototype.contents;
    Express.View.prototype.__defineGetter__('contents', function () {
      throw Error("FS access to views is prohibited once app started.");
    });
    */
    next();
  });
});


// fill in middleware stack and helpers
starter.queue(function (next) {
  var self = this;

  server.use(self.lulz.middleware);
  server.use(Express.bodyParser());
  server.use(Express.methodOverride());
  server.use(Express.cookieParser());
  server.use(server.router);
  
  // last handler starts new cycle with error
  server.use(function RouteNotFound(req, res, next) {
    var err  = new Error('Not Found');
    err.code = 404;
    return next(err);
  });

  // register rerror handler should be configured
  server.error(function(err, req, res, next) {
    logger.error(err, req).error(err.stack);

    req.originalController  = req.controller;
    req.originalAction      = req.action;
    req.controller          = 'errors';
    req.action              = 'error';
    req.error               = err;

    self.dispatcher.dispatch(req, res, next);
  });

  // expose lulz linkTo helper
  server.helpers({lulz_link: self.lulz.helper});
});


// inject server with routers
starter.queue(function (next) {
  app.getAllRouters(function (err, routers) {
    if (err) {
      next(err);
      return;
    }

    try {
      $$.each(routers, function (name, router) {
        router.inject((name == app.name) ? '' : name, server);
      });
    } catch (err) {
      next(err);
      return;
    }

    next();
  });
});


// start server
starter.run(function (err) {
  if (err) {
    console.error(err.stack);
    process.exit(1);
  }

  var listen = $$.merge({port: 8000}, config.listen);
  server.listen(listen.port, listen.host);
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
