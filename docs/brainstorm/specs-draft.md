## Application Structure

```
.
├─ models/
│   └─ *.js
├─ stores/
│   └─ *.js
├─ views/<controller_name>/           # sub-dir per controller
│   ├─ _*.jade                        # partials.js
│   └─ *.jade
├─ config/
│   ├─ settings/
│   │   └─ *.yml                      # settings definitions
│   ├─ locales/
│   │   └─ <lang>.yml                 # language translataions e.g. ru.yml
│   └─ defaults.yml                   # application config
├─ client/<namespace>/.../*.js        # client-only parts of API tree
├─ server/<namespace>/.../*.js        # server-only parts of API tree
├─ shared/<namespace>/.../*.js        # server and client parts of API tree
├─ validator/<namespace>/.../*.js     # server api tree validators
├─ public/
│   └─ *                              # static files + stylus templates
└─ index.js
```

## RPC

Structure of RPC is presented in YAML for readability purposes only

#### Request

``` yaml
--- # structure
version : <str>     # version nodeca protocol
action  : <str>     # API tree action to call
params  : <map>     # Parameters of request
format  : <str>     # (optional) Desired format of response
...
--- # example
version: "1.0"
action: "forums.posts.save"
params:
  title: "C'mon let's release something"
  body: >
    Some really big body...
format: "json"
...
```

#### Response

``` yaml
--- # structure
version : <str>     # version of nodeca protocol
code    : <int>     # result code
data    : <mixed>   # (optional) response data
...
--- # example
version: "1.0"
code: 0
...
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
