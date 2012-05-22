Cli commands
============

Sub applications in nodeca such as server, seed and migration. 
Only one command can be run per session.

`$ ./nodeca.js <commandName> [arg1[arg2[...[argN]]]`

All commands are stored as files in the `/cli` directory, one per file.
Underscore can't be used as a first character of command name.

Command module format
=====================

Property `commandName` is optional. If empty or not exist, then take file name.

`$ ./nodeca.js <commandName> [arg1[arg2[...[argN]]]`


***

Property `initStages` is optional. Array of nodeca init stages. 
Such element is array of stage name and base function.


```javascript
module.exports.initStages= [
  ['models-tree', Nlib.load_models],
  ['shared-tree', Nlib.load_server_api_subtree],
]
```

*Note:* Base variants of most used function see in Nlib api

***
Property `parserParameters` is hash with parser parameters

```javascript
module.exports.parserParameters = {
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

Usage
=====

Commands handlers add to hooks. Hook name equel stage name.
All parsed arguments stored in `nodeca.runtime.cli_args`.


Code example

```javascript
// migrate command
nodeca.hooks.init.after('init-complete.seed',  function(next){
  var seed_name = nodeca.runtime.cli_args.seed;
});

// server command
nodeca.hooks.init.after('bundles', require('./lib/init/http_assets'));
```

Default commands
================

Default commands enabled/desabled from config `Nlib.enabled_defaul_commands.`,
default value `true`.

List of default commands:

`generate` (ToDo)

`destroy` (ToDo)
