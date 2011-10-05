Application
===========

- app/
    - controller/`*_controller.js`
    - models/`*.js`
    - stores/`*.js`
    - views/`<controller_name>/` (sub-dir per controller)
        - `_*.js` (partials)
        - `*.js`
- config/
    - settings/`*.yml`
    - `defaults.yml` (Application read-only (global) configuration)
- public/`*` (Application public static files (images etc.))
- `index.js` (Application main file)