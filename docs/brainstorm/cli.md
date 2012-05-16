Cli
===

`$ ./nodeca.js <command> [arg1[arg2[...[argN]]]`

All commands are stored as files in the `.cli` directory, one per file.
The name of the file is of the form `<command_name>.js`.


Command module format
=====================

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

[parser]:http://docs.python.org/dev/library/argparse.html#argumentparser-objects
[subcommands]:http://docs.python.org/dev/library/argparse.html#sub-commands
[argument]:http://docs.python.org/dev/library/argparse.html#the-add-argument-method
