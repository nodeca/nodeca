Client
------

-   *Server API tree and Router*
    Upon building assets (See static-bundler) we create "wrappers" for all
    server methods and routers.
-   *Dynamic links upgrade*
    Client binds lie listener for all relative links (anchors) and tries to find
    appropriate server method for given URL. In order to achieve this we expose
    router on the client, which is used to find server methods.
-   *Translations and localized views*
    Translator is a wrapper over babelfish-client that allow us to
    forget about 'current locale' pain, by providing one method that does all
    magic for us: `setLanguage(locale)`. Which sets internal locale to the
    specified one (to be used by babelfish) and loads (if necessry) translations
    and localized templates for given locale.

Config
======


``` yaml
version: "1.0.0"                    # Nodeca version
baseurl: "//nodeca.org/assets"      # Base URL for assets
languages: []                       # List of available languages
<lang>:
  assets:                             # per-namespace assets manifest
    <namespace>:
       ...
```
