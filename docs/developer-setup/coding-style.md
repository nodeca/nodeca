Coding Style
============

**All commited code MUST pass Lint**. We supply makefile & package.json
with proper lint defaults. Once again: any code, that you commit,
MUST pass lint!

You must include `use strict` requirement in all your code right after the
copyright comments block, e.g.:

``` javascript
/**
 * nodeca-mega-module
 * Nodeca module that adds mega usefull feature.
 *
 * Copyright (c) 2011 Vasya Pugovkin <vasya@pugovking.com>
 *
 * Licensed under MIT license. See LICENSE.
 */

'use strict';
```

We use [Google's JavaScript coding style](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
as our coding standards.

Code documentation should be written in format of [NDoc](https://github.com/nodeca/ndoc).
See [NDoc Syntax](https://github.com/nodeca/ndoc/blob/master/syntax.md)
for details about it. Use another projects as examples.

**NOTICE**. The rules stated in this document override rules stated
in the above documents if there is a conflict.


### Variable declarations

Exported and public variables should follow standad camelCase naming convention.
Local variables CAN use underscores instead of camelCase. 

If you like to show, that object property is private/protected, and must not be
accessed from outside, show it with double underscores: `__myPrivateVar__`.

We have no restrictions on amount of `var` statements, although we recommend to
keep one per function if it's possible. The only restriction here is readabilty.

**WARNING**. Despite we have no limits on `var` usage, we forbid usage of `var`s
in `for` statments:

``` javascript
// Good
var i;
for (i = 0; i < 10; i++) {
  // ...
}

// Bad
for (var i = 0; i < 10; i++) {
  // ...
}
```

### Hashes

Keep the hash keys tight with 1 space before or after them. Use one space
after each comma.

``` javascript
// Good
{ color: 'blue', part: hat }

// Bad
{ color: 'blue', part: hat}
{color: 'blue', part: hat}
{ color: 'blue',part: hat }
```

Large hashes should be broken up so each key is on one line. This is also useful
for hashes that are changed often, git can track a single key change easily
since it's on a single line.

For big hashes, use alternate comma separator location - place it on the start
of new line.

``` javascript
// Good
issue_attributes = {
  subject: 'Code standards',
  description: 'Bar'
}

// Good, passing a hash style, alternate comma place
issue_attributes({
  subject: 'Code standards'
, description: 'Bar'
, info: 'Baz'
, very: 'long'
, hash: 'list'
})

// Bad
issue_attributes = {
subject: 'Code standards',
description: 'Bar'
}

issue_attributes = {
  subject: 'Code standards', description: 'Bar'
}

issue_attributes = {
                    subject: 'Code standards',
                    description: 'Bar'
}
```

Avoid trying to line up anything more than the start of the keys. They can look
nice but cause the entire hash to be reformatted whenever a key grows. This
makes tools like git blame more difficult to use and track what happened.

``` javascript
// Before
issue_attributes = {
  subject:     'Code standards',
  description: 'Bar'
}

// After, notice how the change was to the first key but the second one also
// had to be changed to be reformatted.
issue_attributes = {
  subject_was_extended: 'Code standards',
  description:          'Bar'
}
```


### Commenting

You should document ANY method|property that might be reached from the outside.
You may want to mark property as _protected_, but make sure to document it in
order to avoid any collisions and misunderstandings. E.g.:

``` javascript
/**
 *  Human#__heart__ -> Heart
 *
 *  **PROTECTED**
 *  Very important part of instance.
 **/
```

Do not document (with PDoc) anything that is not reachable outside. Comment them
inline with reasonable comments:

``` javascript
Human.prototype.think = funtion think() {
  // Instace of [[Idea]]
  var idea;
};
```

Do not document HOW (algorithm) function works. Document WHAT does it doing.
For example, this documentation is shit:

``` javascript
/**
 *  Human#walk(steps) -> Void
 *
 *  Get active leg, get control over the leg, turn it to the new position,
 *  switch active leg, reduce amount of steps by one, repeat until steps
 *  counter reach zero.
 **/
```

Instead of literal explanation of source code (who needs to know the algorithm
can read source code without any problem), describe what it does:

``` javascript
/**
 *  Human#walk(steps) -> Void
 *
 *  Moves instance forward on specified amount of `steps`.
 */
```

If your method use some formula, put it into the description:

``` javascript
/**
 *  log(number[, base = 10]) -> Number
 *  - number (Number): Logarithm number
 *  - base (Number): Base of logarithm
 *
 *  Returns logarithm of `numer` to the `base`.
 *
 *  ##### Formula
 *
 *  base^x = number
 **/
```


## Nodeca-specific

1. File with models, loaded into API Tree, must have capitalized first letter.
   Because models are classes. Using capital letters in file names
   can be disputed in general, but it's acceptable trade-off in our case,
   to keep code simple.


## Scripts and functions

Under [scripts](scripts/) directory you will find scripts and utilities for
making your dev-days a little bit easier:

- [Makefile](scripts/Makefile) contains often-used tasks:
  - `make lint` runs lint on your code
  - `make test` runs all test suites
  - `make docs` updates API documentation in `./doc/`
  - `make gh-pages` updates gh-pages branch with latest API documentation

Simply copy contents of [scripts](scripts/) directory into root of your new
project to make your life shiner.
