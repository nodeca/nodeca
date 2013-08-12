Forums / Blogs / Groups / Classfields / ...
===========================================

[![Build Status](https://secure.travis-ci.org/nodeca/nodeca.png)](http://travis-ci.org/nodeca/nodeca)

Platform, for medium and big traffic projects, written with node.js

* Bleeding edge demo: **http://dev.nodeca.com**
* Design process: https://github.com/nodeca/nodeca-design
  (materials can be outdated)


Requirements
------------

* node.js
* MongoDB (big size, images are stored in GridFS)
* redis
* sphinx search
* Image Magick
* nginx (for production)

Please, note, that since Nodeca is for medium/big projects, we have no goal to run it on
cheapest VPS. Memory requirements depends on stored image volume - we use GridFS to simplify
maintainability of big collections. May be, sometime, we will add alternate file store
for starter projects, but now we just have no time for it.


Installation
------------

See [instructions](https://github.com/nodeca/nodeca/blob/master/INSTALL.md).


About
-----

Basically, this project was started as [RC Design](http://forum.rcdesign.ru)'s
next generation platform, and funded by me, Vitaly Puzrin :) . But since i'm
opensource fan, source code has no specific locks to my needs, and distributed
under MIT licence.

Here are ton's of reasons, why Nodeca started:

1. __Easy development/maintenance__. No ancient manual downloads of php sources,
   boring upgrades and missed security fixes. Just use github, Luke! And node.js's npm.

2. __Very fast, scaleable to infinity__. Forget about CPU load. Just add one more shard,
  when db is out of space. We use MongoDB, wich makes sharding/replication trivial,
  and protects from injections.

3. __HTML5, mobile-in-mind__. Not just modern look, but modern internals too.
  Content automatically fitted to screen size and resolution. Very fast load.
  Retina-ready - all icons as vector fonts. SEO-friendly. No needs to maintain multiple
  products in parallel - website is good for all devices, without compromisses.

4. __Realtime updates & client-side rendering__. Any page can be automatically updated
  without full reload, when new information added. When user navigates site with modern
  browser, only raw data is loaded, without html - very fast responce time.
  See [our demo](http://dev.nodeca.com/), and pay attention to timeline at the end
  of each page.

5. __With medium/big projects in mind__. Commercial "forums" are optimized for maximum
  sell volumes. So, their first-class customers are small sites. Medium/Big ones have
  another needs - mainteinability, scaleability, highload, security. Nodeca is here :)


You can participate
-------------------

If you have similar goals - you can participate in Nodeca development. Please, note,
that we are not "free developpers for your needs", and we can not be hired. But we can
coordinate our efforts with your ones. Though, if you have better collaboration ideas -
that's discussable.


Contacts
--------

Discussions:

- [nodeca](https://groups.google.com/group/nodeca/) - english
- [nodeca-ru](https://groups.google.com/group/nodeca-ru/) - russian

Direct help proposals:

- vitaly@rcdesign.ru


