Client Config and Assets map
----------------------------

Config file can be partially "filled". When we load app first time in the
browser, we read full config, later while switching between applications or
languages we load "partial" configs in case we need them only.

``` yaml
## GENERAL SECTION. (full+partial) #############################################

version: "1.0.0"                    # Nodeca version
baseurl: "//nodeca.org/assets"      # Base URL for assets
languages: []                       # List of available languages

## I18N SECTION. (full+partial) ################################################

<lang>
  assets:                           # per-namespace assets manifest
    <namespace>:
    # ...

## ROUTER SECTION. (full) ######################################################

routes:
  <route>:                          # see router specification for details
    <options>
  ...

direct:
  - <method>                        # see router specification for details
  # ...
```
