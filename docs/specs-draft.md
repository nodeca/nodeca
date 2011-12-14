## Application Structure

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
│   ├─ locales/
│   │   └─ <lang>.yml             # language translataions e.g. ru.yml
│   └─ defaults.yml               # application config
├─ lib/
│   ├─ client/                    # client-only parts of API tree
│   │   └─ <a>/{...}/<z>.js       # (example) tree part: nodeca.a.{...}.z
│   ├─ server/                    # server-only parts of API tree
│   └─ shared/                    # server and client parts of API tree
├─ public/
│   └─ *                          # static files + stylus templates
└─ index.js
```

## RPC

#### Request

```
{
  "v": <str>,   // version of nodeca protocol
  ...
}
```

#### Response

```
{
  "v": <str>,   // version of nodeca protocol
  "c": <int>,   // response code
  ...
}
```

Response codes are fixed and can be:

    0   OK
    400 CLIENT ERROR
    401 VERSION MISMATCH
    500 SERVER ERROR


## Assets Config

```
{
  "i18n": // i18n | tpl
  {
    "<namespace>":
    {
      "url": "/foobar/aha.cbmd5sum.js",
      "md5": "cbmd5sum"
    }
  }
}
```

## Server-side view helpers

- `assetUrl(name)`
- `javascripts([namespace = 'all'])`
- `stylesheets([namespace = 'all'])`
