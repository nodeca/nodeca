Server
------

-   *Translations and localized views*
    API tree knows nothing about current language or locale. So we have a copy
    of API tree for each language, so calls to localized API tree looks like:
    `lang('ru').nodeca.client.method()`. Also we provide `setLanguage()` that
    sets global tree to be linked to the tree of given locale.
-   *HTTP Request (SEO URL) routing)*
    Server provides router that is configured to "map" direct HTTP requests to
    the server API tree. Router defines rules of forming a vlid API request
    message which can be passsed to dispatecher then.
-   *Server API methods*
    Dispatcher calls each appropriate server API tree method providing `env`
    object, that contains all request information and methods for response,
    e.g.: `env.response({ 'json': obj, 'html': 'view.name' })
    When view is rendered it receives env as global context.
-   *API method filters*
    We provide event-based filters. Each method filter binds via `nodeca.filter`
    object with name of method it want to be used against, e.g.:
    `nodeca.filter.on('admin.dashboard', function (env) {})`. Also it is
    possible to bind filter on all sub-nodes: `admin.dashboard.*` or on both at
    the same time: `['admin.dashboard', 'admin.dashboard.*']`. When action
    `admin.dashboard.foobar` is executed it will call filters (in order of
    execution): `admin.*`, `admin.dashboard.*`, `admin.dashboard.foobar`.
