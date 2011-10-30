Coding Style
============

You must include `use strict` requirement n all your code right after the
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

You must make sure, that your code passes JSLint checks.


We use [Google's JavaScript coding style][1] as our coding standards.

Code documentation should be written in format of [PDoc][2].
See [PDoc Syntax][3] for details about it.

**NOTICE**
The rules stated in this document override rules stated in the above documents
if there is a conflict.

### Hashes

Keep the hash keys tight with no whitespace before or after them. Use one space
after each comma.

    # Good
    {color: 'blue', part: hat}

    # Bad
    { color: 'blue', part: hat}
    { color: 'blue', part: hat }
    {color: 'blue',part: hat}

Large hashes should be broken up so each key is on one line. This is also useful
for hashes that are changed often, git can track a single key change easily
since it's on a single line.

    # Good
    issue_attributes = {
      subject: 'Code standards',
      description: 'Bar'
    }
    
    # Good, passing a hash style
    issue_attributes({
      subject: 'Code standards',
      description: 'Bar'
    })

    # Bad
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

Avoid trying to line up anything more than the start of the keys. They can look
nice but cause the entire hash to be reformatted whenever a key grows. This
makes tools like git blame more difficult to use and track what happened.

    # Before
    issue_attributes = {
      subject:     'Code standards',
      description: 'Bar'
    }
    
    # After, notice how the change was to the first key but the second one also
    # had to be changed to be reformatted.
    issue_attributes = {
      subject_was_extended: 'Code standards',
      description:          'Bar'
    }

### Commenting

You should document ANY method|property that might be reached from the outside.
You may want to mark property as _protected_, but make sure to document it in
order to avoid any collisions and misunderstandings. E.g.:

    /**
     *  Human#__heart__ -> Heart
     *
     *  **PROTECTED**
     *  Very important part of instance.
     **/

Do not document (with PDoc) anything that is not reachable outside. Comment them
inline with reasonable comments:

    Human.prototype.think = funtion think() {
      // Instace of [[Idea]]
      var idea;
    };

Do not document HOW (algorithm) function works. Document WHAT does it doing.
For example, this documentation is shit:

    /**
     *  Human#walk(steps) -> Void
     *
     *  Get active leg, get control over the leg, turn it to the new position,
     *  switch active leg, reduce amount of steps by one, repeat until steps
     *  counter reach zero.
     **/

Instead of literal explanation of source code (who needs to know the algorithm
can read source code without any problem), describe what it does:

    /**
     *  Human#walk(steps) -> Void
     *
     *  Moves instance forward on specified amount of `steps`.
     */

If your method use some formula, put it into the description:

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


## Scripts and functions

Under [scripts](scripts/) directory you will find scripts and utilities for
making your dev-days a little bit easier:

- [Makefile](scripts/Makefile) contains often-used tasks:
  - `make test` runs all test suites
  - `make docs` updates API documentation in `./doc/`
  - `make gh-pages` updates gh-pages branch with latest API documentation
- [support/generate-docs.rb](scripts/support/generate-docs.rb) PDoc runner

Simply copy contents of [scripts](scripts/) directory into root of your new
project to make your life shiner.

Once you put scripts into your project's root, open `support/generate-docs.rb`
and edit some variables to fit your project:

    PROJECT_NAME="nodeca"
    GITHUB_NAME="nodeca/nodeca"

For example if you are developing `nodeca-blogs` and your repo is available on
GitHub as `https://github.com/ixti/nodeca-blogs/` set variables as:

    PROJECT_NAME="nodeca-blogs"
    GITHUB_NAME="ixti/nodeca-blogs"


[1]: http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
[2]: http://pdoc.org/
[3]: http://pdoc.org/syntax.html
