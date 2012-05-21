
Runner
======

Sub applications in nodeca such as server, seed and migration. One runner per sesion

`$ ./nodeca.js <runnerName> [arg1[arg2[...[argN]]]`

All runners are stored as files in the `.runners` directory, one per file.
Underscore can't be used as a first character of runner name.

Command module format
=====================

Property `runnerName` is optional. If empty or not exist, then take file name.

`$ ./nodeca.js <runnerName> [arg1[arg2[...[argN]]]`


***

Property `initStages` is optional. Array of nodeca init stages.

```javascript
module.exports.parserParameters = [
  'init-start',
  'models-tree',
  'shared-tree'
]
```

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

All parsed arguments stored in `nodeca.runtime.cli_args`.
Runners handlers add to extended base hooks. Hooks format <hookName>.<runnerName>`,
for example `init_before.server`.

*Note:* Handler from different runners can't be run in same session.

Code example

```javascript
// migrate runner
nodeca.hooks.init.after('init-complete.migrate',  require('./lib/init/migrate'));

// server runner
nodeca.hooks.init.after('init-complete.server',  require('./lib/init/migrations_check'));
nodeca.hooks.init.after('init-complete.server',  require('./lib/init/http_server'));

```


