Application
===========

- app/
    - controller/
        - `*_controller.js`
    - models/
        - `*.js`
    - stores/
        - `*.js`
    - views/
        - `<controller_name>/` (sub-dir per controller)
            - `_*.js` (partials)
            - `*.js`

Files and Directories Structure
-------------------------------

Files and directories structure was inspired by Ruby on Rails, so it should be
more or less familiar for those who has experience with RoR.

```
.                               #
+- app/                         #
|  +- controllers/              # Application controllers
|  |  `- foobar_controller.js   # (example) FoobarController
|  |                            #
|  +- models/                   # Application models (Mongoose schemas)
|  |  `- foo_bar.js             # (example) FooBar
|  |                            #
|  +- stores/                   # Application stores
|  |  `- foo_bar.js             # (example) FooBar
|  |                            #
|  `- views/                    # Application views
|     `- foobar/                # (example) views for FoobarController
|        |- index.html.jade     # (example) FoobarController#index action view
|        `- demo.html.jade      # (example) FoobarController#demo action view
|                               #
+- config/                      # Application configuration
|  +- settings/                 # Settings definitions
|  |  `- anything.yml           # (example) bunch of settings
|  `- defaults.yml              # Application read-only (global) configuration
|                               #
+- public/                      # Application public static files (images etc.)
|                               #
`- index.js                     # Application main file
```
