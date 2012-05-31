CLI
===

Typical application call format:

`$ ./nodeca.js <command> ...`

In real life:

* `./nodeca.js server`
* `./nodeca.js migrate --all`

All comands are separated by files. When application starts, it search all
`*.js` files `./cli/` folders, and register those as commands. Then process
arguments and run appropriate command.


Command module format
=====================

### commandName

Optional. Name of command, registered by this module. If empty or not exists,
then file name will be used (without extention).


### parserParameters

Hash with parser parameters

```javascript
module.exports.parserParameters = {
  version: nodeca.runtime.version,
  addHelp:true,
  help: 'controls nodeca server',
  description: 'Controls nodeca server ...'
};
```

*Note:* See also [ArgumentParser objects](http://docs.python.org/dev/library/argparse.html#argumentparser-objects)
and [sub-commands](http://docs.python.org/dev/library/argparse.html#sub-commands)
in original parser guide.


### commandLineArguments[]

List of arguments definitions.

```javascript
module.exports.commandLineArguments = [
  { args: ['-p','--port'], options: { type: 'int'} },
  { args: ['--host'], options: {defaultValue: 'localhost'} }
];

```

*Note:* See also  [add_argument()](http://docs.python.org/dev/library/argparse.html#the-add-argument-method)
in parsed docs.


### run(args, callback)

Executes command.

```javascript
module.exports.run = function (args, callback) {
  Async.series([
    // init stages
    require('../lib/init/mongoose'),
    NLib.init.loadModels,
    // ...
  ], function(err) {
    // some code
    callback(err)
  });
};
```

First argument contain simple hash({key:vakue}) with parsed arguments

```javascript
{ port: 3000, host: 'localhost' }
```
