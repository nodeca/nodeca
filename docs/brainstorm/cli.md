Cli
===

`$ ./nodeca.js <commandName> [arg1[arg2[...[argN]]]`

All commands are stored as files in the `.cli` directory, one per file.
The name of the file, do not use underscore as first character
see "Cli extending" section


Command module format
=====================

Property `commandName` is optional. If empty or not exist, then take file name.

`$ ./nodeca.js <commandName> [arg1[arg2[...[argN]]]`


***

Method `run` method has two argument callback and hash with input parameters

In this method vailable all models and other nodeca resources

```javascript
module.exports.run = function (callback, args) {
  //some code
}
```

***

Property `parserParameters` is hash with parser parameters

```javascript
module.exports.parserParameters= {
  version: nodeca.runtime.version,
  addHelp:true,
  help: 'controls nodeca server',
  description: 'Controls nodeca server ...'
};
```

*Note:* info about parameters see in [ArgumentParser objects][parser] and for [sub-commands][subcommands] guide sections

***

Property `commandLineArguments` is list of arguments

```javascript
module.exports.commandLineArguments = [
  { args: ['-p','--port'], options: { type: 'int'} },
  { args: ['--host'], options: {defaultValue: 'localhost'} }
];

```

*Note:* information about argument options see in [guide][argument]

Run cli command with out nodeca.core handler
============================================


```javascript
var cli = require('./cli/command_name.js');
var parser = new argparse.ArgumentParser(cli.parserParameters);
parser.commandLineArguments.forEach(function(item) {
  parser.addArgument(item.args, item.options);
});
var args = parser.parseAgrgs();
// some code
```

Extentending existing scripts
========================

File names must start from underscore and placed in cli folder

```
└─ cli/
   ├─ /.../_*.js
   └─ _*.js

```



`parserParameters` and `commandLineArguments` can be extended with 
`cli_prepare` hook.
Extension function should have three arguments `parserParameters`,
`commandLineArguments` and callback function


```javascript
var func = function(parserParameters, commandLineArguments, next)
  // some code
  next();
;

nodeca.hooks.cli.before('cli_prepare', func); 

```

***

`run` can be extended with `cli_run.<command_name>` hook
Extension function argument same as `run`

```javascript
var func = function(args, next) {
  // some code
  next();
}

nodeca.hooks.cli.before('cli_run.server', func); 
```

[parser]:http://docs.python.org/dev/library/argparse.html#argumentparser-objects
[subcommands]:http://docs.python.org/dev/library/argparse.html#sub-commands
[argument]:http://docs.python.org/dev/library/argparse.html#the-add-argument-method
