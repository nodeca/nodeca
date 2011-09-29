TODO
====

### nodeca-lib

* Import Underscore. Replace duplicate `Utilities` methods with mappings to
  `underscore's` methods and DEPRECATION ERROR (for easy debugging upon start up)
* Add comments about waterfalls in test.js
* Clean-up Utilities (remove obsolete methods)
* Exports underscore as part of nodeca-lib

---

* https://github.com/nodeca/nodeca-lib/blob/lib/nodeca_lib/permission.js
  * L103: Improve test string parser by replacing it with solid Tokenizer
  * L194: Rename constructor's first argument `getter`
* https://github.com/nodeca/nodeca-lib/blob/lib/nodeca_lib/settings.js
  * L59: Handle non-bool values
* https://github.com/nodeca/nodeca-lib/blob/lib/nodeca_lib/settings/store.js
  * L69: Describe preloader, setter and getter properties
  * L227: Replace recursive calls with promises
* https://github.com/nodeca/nodeca-lib/blob/lib/nodeca_lib/application.js
  * L284: Add list of available hook names (reference to HOOKS array I guess)
* https://github.com/nodeca/nodeca-lib/blob/lib/nodeca_lib/application/initializer.js
  * L1: Improve load_schemas|models to accept any models (not only Mongoose)
  * L2: Refactor initializer into pieces
