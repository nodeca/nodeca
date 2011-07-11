var ApplicationController = require('./application_controller');


var ErrorsController = function ErrorsController(app) {
  ApplicationController.call(this, app);


  this.beforeFilter(function errorFixator(req, res, next) {
    req.error = req.error || Error('Direct acces to error controller');
    res.local('error', req.error);
   
    next();
  });


  this.error = function error(req, res, next) {
    switch (req.error.code) {
      case 404:
        res.render('errors/404', {status: 404, description: 'Not Found'});
        return;

      default:
        res.render('errors/500', {status: 500, description: 'Application Error'});
        return;
    }
  };
};


ApplicationController.adopts(ErrorsController).export(module);


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
