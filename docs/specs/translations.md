i18n
====

Design goals
------------

- easy translation for resourses
- both for server + client
- easy programming
- plurals support

Why? Because existing solutions could be better :)

**Concepts:**

1. Мost texts are in templates. We need instruments to generate localized templates automatically on application start.
2. Plurals support in `gettext` is really sophisticated. It would be great to have simple syntax.
3. Some useful `gettext` features (contexsts and so on)
4. Tools to automate phrases extraction from templates and source code.
5. (?) Gender support
6. Transparent fallback to default language

Plurals
-------

We use macros ((...)) to define plurals.

### Example 1. Single var -> 1 or more plurals

    Look, ((there is|there are)) #{ap_count} ((apple|apples)) on the table

Plurals are in double brakets. Variable used to change proper value.

(*) Escape if really needs double brackets as plain text

### Example 2. Several vars -> plurals, all plurals on the right

More rare, but also possible case. Usually, plurals goes after numbers.
So, pattern is still simple

    #{ap_count} ((apple|apples)) and #{p_count} ((pie|pies)) on the table

### Example 3. Several vars <-> plurals, random order

Almost impossible case, but still needed. A bit dirty syntax, but probably never happens :) .

    Look, ((there is|there are)):apcount #{ap_count} ((apple|apples)) and #{p_count} ((pie|pies)) on the table

We use quantifier to directly assign variable for first plural.


Gender
------

Use similar to plurals macros for gender definition:

    g((male form|female form))

or

    g((male form|female form)):gender_var

Variable is used as array index. Default name is `gender`. It will be searched in visible vars.


Speed optimizations, client/server difference
---------------------------------------------

There are 2 cases:

1. Static translations (no parameters)
2. Computed translations (with plurals/gender)

Static translations should be embedded directly into templates on app start. That reduces computations on each data request.

Computed phrases are functions.

- Server side - no problems. `__(...)` is available there, phrases are loaded & cached on app start.
- Client side. For single-page apps we should provide `__(...)' on client.
  - don't pass all phrases, since most are built into template. care about traffic.
  - care about partial load, if application is splitted by submodules

(*) Provide helper to generate localized templates

Helper functions
----------------

### __(lang, phrase[, context, options, namespace])

Returns translated phrase

### __n(lang, singular, plural1 [, plural2...], count)

Returns plural form, depending on count and language. See example here https://github.com/masylum/dialect/blob/master/lib/helpers/plurals.js

# TBD

- errors display on the client (fallback to default language or plain phrase?)
- (?) events on server
- contexts
- split phrases by projects (namespaces)
  - each subproject can have personal master-file
  - hide duplicated phrases in interface, but keep in exports
- files format
  - (?) JSON / Yaml
  - check how to import/export
  - make tool to autogenerate master files

# Later

- babelfish-like auto translator https://github.com/jbasdf/babelphish/tree/master/lib
  use http://mymemory.translated.net , since google API discontinued

