Coding Style
============

We use [Google's JavaScript coding style](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
as our coding standards.

Code documentation should be written in format of [PDoc](http://pdoc.com). See
[PDoc Syntax](http://pdoc.org/syntax.html) for details about it.

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

