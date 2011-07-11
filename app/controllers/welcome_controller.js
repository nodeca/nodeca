var ApplicationController = require('./application_controller');


var WelcomeController = function WelcomeController(app) {
  ApplicationController.call(this, app);


  this.index = function index(req, res, next) {
    res.render('welcome/index');
  };
};


ApplicationController.adopts(WelcomeController).export(module);


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
