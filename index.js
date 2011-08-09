var nodeca = require('nodeca-lib'),
    express = nodeca.Express,
    $$ = nodeca.Utilities,
    app = new nodeca.Application(__dirname),
    init_server;


// register unexpected exceptions handler
process.on('uncaughtException', function(err) {
  console.log('UNHANDLED EXCEPTION: ' + err.message);
  console.error(err.stack);
});


app.readConfig('application', app.env, function (err, config) {
  if (err) {
    console.error('Failed read app config: ' + err.stack);
    process.exit(1);
  }


  app.init(config, function (err) {
    if (err) {
      console.error('Failed init app: ' + err.stack);
      process.exit(1);
    }


    app.getLogger(function (err, logger) {
      var flow = $$.waterfall(),
          server = express.createServer();

      if (err) {
        console.error('Failed get logger: ' + err.stack);
        process.exit(1);
      }

      // configure views renderer
      flow.queue(function (next) {
        app.getAllViews(function (err, dir, files) {
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
      flow.queue(function (next) {
        var finished = new Promise.Joint(),
            lulz, dispatcher;

        app.getStatcLulz(finished.promise().resolve);
        app.getDispatcher(finished.promise().resolve);

        finished.wait().done(function (err, p1, p2) {
          if (err = err || p1[0] || p2[0]) {
            next(err);
            return;
          }

          lulz = p1[1], dispatcher = p2[1];

          server.use(lulz.middleware);
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
        
            dispatcher.dispatch(req, res, next);
          });

          // expose lulz linkTo helper
          server.helpers({lulz_link: lulz.helper});
        });
      });

      // inject server with routers
      flow.queue(function (next) {
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
      flow.run(function (err) {
        if (err) {
          console.error('Failed get logger: ' + err.stack);
          process.exit(1);
        }

        var listen = $$.merge({port: 8000}, config.listen);
        server.listen(listen.port, listen.host);
      });
    });
  });
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
