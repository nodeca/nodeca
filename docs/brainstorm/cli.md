Format
======
Both global and sub-commands scripts has same format

All script must have exported method `run` method and propertis `parserParameters` `commandLineArguments`

Method `run` has two arguments callback and args. Argument args contains already parsed command line arguments

This is body of script. Available all models and other nodeca resources

Property `parserParameters` is hash with parser parameters, 
info about see in [ArgumentParser objects][parser] section and for sub-commands additional [info][subcommands]

Property `commandLineArguments` is list of arguments each item has format

```javascript
{
  args =[<argument name or flags>],
  options = {<argument options>}
}
```
Additional information about argument options see in [guide][argument]

Global
=========

Top level parser load settings from main module for example ```nodeca.core/lib/cli.js```
If file not exists get version and description from `package.json`.
This file must by unique in the system.

Example

```javascript
// main parser parameters
// additional info see in 
// http://docs.python.org/dev/library/argparse.html#argumentparser-objects
module.exports.parserParameters = {
  addHelp: true
}

// List of command-line arguments.
// Arguments format see in
// http://docs.python.org/dev/library/argparse.html#sub-commands
module.exports.commandLineArguments = [
  {
    args: ['--version'],
    options: {
      constant: '0.1,0'
    }
  },
  {
    args: ['-v','--verbose'],
    options: {
      action, 'count'
    }
  },
];
// run some general operations
// optional
module.exports.run = function(callback,args){
  callback();
}
```

Sub-comands
===========
Sub-commands are stored as files in the `./cli` directory, one per file.
The name of the file is of the form `<command_name>.js`.

```javascript
// Argument parser parameters
// http://docs.python.org/dev/library/argparse.html#argumentparser-objects
// Furthermore, supports an additional aliases argument,
// which allows multiple strings to refer to the same subparser.
// Like svn, aliases co as a shorthand for checkout.
module.exports.parserParameters= {
  // command version(equal nodeca version)
  version: nodeca.runtime.version,
  addHelp:true,
  // short command annotation in own help
  // $./nodeca.js -h
  help: 'controls nodeca server',
  // command description in command help
  // $./nodeca.js server -h
  description: 'Controls nodeca server ...'
  // othere options see at doc
};


// List of command-line arguments.
// Arguments format
// http://docs.python.org/dev/library/argparse.html#the-add-argument-method
module.exports.commandLineArguments = [
  {
    args: ['c'],
    options: {
      metavar: 'COMMAND',
      choices: ['start','stop','status']
    }
  },
  {
    args: ['-p','--port'],
    options: {
      type: 'int'
    }
  },
  {
    args: ['--host'],
    options: {
      defaultValue: 'localhost'
    }
  }
];

/**
 * run(callback, args)-> void
 * - callback(function): callback function
 * - args (array): parsed arguments
 *
 * args example:
 *   {
 *     command_name: 'server',
 *     c: 'start',
 *     port: 3000,
 *     host: '127.0.0.1'
 *   }
 *
 **/
module.exports.run = function (callback, args) {
  console.dir(args);
  switch (args.c) {
    case 'start':
      console.dir('server start on ' + args.host + ':' + args.port);
      break;
    case 'stop':
      console.dir('stop');
      break;
    case 'status':
      console.dir('status');
      break;
    default:
      console.dir('undefined server command');
  }
  process.exit();
};
```

Work with scripts in nodeca.core
===================
Set on two hooks

1. Collect scripts to general parser and parse input parameters. Set on `init-start` hook(before write some info to stdout)

2. Run fetched command. set on `init-complete`


Run cli command with out nodeca.core handler
============================================


```javascript
var cli = require(file);
var parser = new argparse.ArgumentParser(cli.parserParameters);
parser.commandLineArguments.forEach(function(item) {
  parser.addArgument(item.args, item.options);
});
var args = parser.parseAgrgs();
// some code
```

[parser]:http://docs.python.org/dev/library/argparse.html#argumentparser-objects
[subcommands]:http://docs.python.org/dev/library/argparse.html#sub-commands
[argument]:http://docs.python.org/dev/library/argparse.html#the-add-argument-method
