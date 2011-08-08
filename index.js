var nodeca = require('nodeca-lib'),
    app = new nodeca.Application(),
    server = new nodeca.Server(app);


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

  server.start(config, function (err, server) {
    if (err) {
      console.error('Failed to start app: ' + err.stack);
      process.exit(1);
    }
  });
});


////////////////////////////////////////////////////////////////////////////////
// vim:ts=2:sw=2
////////////////////////////////////////////////////////////////////////////////
