Dir Structure
=============

Directores below are processed automaticallty during init.

```
.
├─ app/
│   ├─ controller/
│   │   └─ *_controller.js
│   ├─ models/
│   │   └─ *.js
│   ├─ stores/
│   │   └─ *.js
│   └─ views/<controller_name>/   # sub-dir per controller
│       ├─ _*.jade                # partials.js
│       └─ *.jade
├─ config/
│   ├─ settings/
│   │   └─ *.yml                  # settings definitions
│   └─ defaults.yml               # application config
├─ public/
│   └─ *                          # static files + stylus templates
└─ index.js
```

Hooks
=====

Modifications are available via hooks. You can monkey-patch code, add new templates, assets and do anything else
during init. Look [hooks list](http://nodeca.github.com/nodeca-lib/Application/addHook/index.html) in documentation.
Also, there is an [example](http://nodeca.github.com/nodeca-lib/Application/index.html), ho to add hooks in your app.
