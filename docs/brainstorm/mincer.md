mincer
======

Sprockets inspired web assets compiler. It features same declarative dependency
management as Sprockets (with exactly same language) for CSS and JavaScript and
preprocessor pipeline that allows you to write assets in the languages like
CoffeeScript, LESS, Stylus.

See [Sprockets](https://github.com/sstephenson/sprockets) for details.


JavaScript Templating with EJS and Eco
--------------------------------------

Not gonna be implemented yet. In future it should support: Jade, Handlebars,
Hogan, EJS etc.


API Overview
------------

``` javascript
var mincer = require('mincer');
var env    = new mincer.Environment(__dirname);

// configure environment

env.appendPath('app/assets/javascripts');
env.appendPath('app/assets/stylesheets');


// get asset by logical path
var asset = env.findAsset('application.js'); // -> Mincer.BundledAsset

asset.toString();   // Returns asset string contents
asset.length;       // Length in bytes
asset.mtime;        // Last moodified time
asset.pathname;     // Path on filesystem
asset.digest;       // SHA1 sum of asset content
                    //    -> "791abb4f42f12839402966d8d50434f6"
asset.digest_path;  // URL path of the bundled assets:
                    //    -> "application-791abb4f42f12839402966d8d50434f6.js"


// writing file bundles
var manifest = new mincer.Manifest(env, __dirname + '/manifest.json');
manifest.compile('application.js', 'application.css');
```


Nodeca-specific
---------------

We provide special helper `asset_path('foobar.js')` that returns URL path for
asset respecting _assets prefix_ and _digest path_.
