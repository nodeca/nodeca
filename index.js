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


// read application config and start app initialization
starter.queue(function (next) {
  var self = this;

  app.readConfig('application', app.env, function (err, config) {
    if (err) {
      next(err);
      return;
    }

    app.init(config, next);
  });
});


// prepare server
starter.queue(function (next) {
  app.viewsBuilder.compile(function (err, dir, files) {
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
  server.use(app.staticLulz.middleware);
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

    app.dispatcher.dispatch(req, res, next);
  });

  // expose lulz linkTo helper
  server.helpers({lulz_link: app.staticLulz.helper});
  next();
});


// inject server with routers
starter.queue(function (next) {
  try {
    $$.each(app.routers, function (name, router) {
      router.inject((name == app.name) ? '' : name, server);
    });
  } catch (err) {
    next(err);
    return;
  }

  next();
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
