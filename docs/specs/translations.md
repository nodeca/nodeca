
General
=======

We plan to use Jade, so it will be most convenient to use this [jade-i18n progect](https://github.com/LearnBoost/jade-i18n).
It has lack of some deature:

- No embedded plurals support
  - https://github.com/LearnBoost/jade-i18n/issues/3
  - https://github.com/masylum/dialect/blob/master/lib/helpers/plurals.js
- No context-depended phrases support
  - https://github.com/LearnBoost/jade-i18n/issues/4
- No built-in i18n __() for translations without templates

Automation
==========

We need effective instrument to make translations. [dialect-http](https://github.com/masylum/dialect-http)
looks promissing.

Do we really need it? May be, use ubuntu launchpad or similar for the first time? Check for free & nice
alternative to https://webtranslateit.com/ .

### Missed features

- split phrases by groups
  - NOT by projects, because we like to show all phrases at once. Just allow to load files.
  - each subproject can have personal master-file
  - hide duplicated phrases in interface, but keep in exports
- files format
  - JSON
  - check how to import/export
  - make tool to autogenerate master files
- authorization/registration via loginza

### Later

- babelfish-like auto translator https://github.com/jbasdf/babelphish/tree/master/lib
- replace loginza service with own (from nodeca?).
- allows distributed collection of translations


Overrides
=========

Override mechanism for specific phrases is very similar to skins. Create file with
phrases definitions, and add extension `.override`. Phrases from such file will override
basic one.
