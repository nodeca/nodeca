// Prepares request environment (`this` context of server methods/filters).


'use strict';


/**
 *  lib
 **/


/*global N, underscore*/


// 3rd-party
var Puncher = require('puncher');
var _       = underscore;


// internal
var render  = require('./render/common');
var date    = require('./date');


////////////////////////////////////////////////////////////////////////////////


var tzOffset = (new Date).getTimezoneOffset();


//  deepClone(obj) -> Object
//  - obj (Mixed): Original object to get cloned
//
//  Returns a deep copy of given object. All nested objects are deeply copied
//  instead of passing by reference.
//
//  **WARNING** This is a potentional bottleneck and performance-killer,
//              although it's used for a trivial case. Probably it would be
//              better to change it to `JSON.parse(JSON.stringify(obj))`
//
function deepClone(obj) {
  // TODO: Add preventor of circular dependencies

  if (!_.isObject(obj) || _.isFunction(obj)) {
    return obj;
  }

  if (_.isDate(obj)) {
    return new Date(obj.getTime());
  }

  if (_.isRegExp(obj)) {
    return new RegExp(obj.source, obj.toString().replace(/.*\//, ""));
  }

  if (_.isArray(obj) || _.isArguments(obj)) {
    return Array.prototype.map.call(obj, function (val) {
      return deepClone(val);
    });
  }

  return _.reduce(obj, function (memo, val, key) {
    memo[key] = deepClone(val);
    return memo;
  }, {});
}


////////////////////////////////////////////////////////////////////////////////


/**
 *  lib.env(options) -> Object
 *  - options (Object): Environment options.
 *
 *  Create new request environment object.
 *
 *
 *  ##### Options
 *
 *  - **http**: HTTP origin object that contains `req` and `res`.
 *  - **rpc**: API3 (Ajax) origin that contains `req` and `res`.
 *  - **skip**: Array of middlewares to skip
 *  - **session**: Session object
 *    - **theme**: Theme name as String
 *    - **locale**: Locale name as String
 *  - **method**: Name of the server method, e.g. `'forums.posts.show'`
 *  - **layout**: Layout name as String
 **/
module.exports = function env(options) {
  var req     = (options.http || options.rpc).req;
  var method  = String(options.method || '');
  var ns      = method.split('.').shift();

  var ctx = {
    extras:  {
      puncher: new Puncher()
    },
    helpers: {
      asset_path: function asset_path(path) {
        var asset = N.runtime.assets.manifest.assets[path];
        return !asset ? "#" : N.runtime.router.linkTo('assets', { path: asset });
      }
    },
    origin: {
      http: options.http,
      rpc: options.rpc
    },
    skip: (options.skip || []).slice(),
    session: options.session || null,
    request: {
      // FIXME: should be deprecated in flavour of env.origin
      origin:     !!options.rpc ? 'RPC' : 'HTTP',
      method:     method,
      ip:         req.connection.remoteAddress,
      user_agent: req.headers['user-agent'],
      namespace:  ns
    },
    data: {},
    runtime: {
      // FIXME: must be set from cookies
      theme: 'desktop'
    },
    settings: {
      params: {},
      fetch: function fetchSettings(keys, callback) {
        N.settings.get(keys, this.params, {}, callback);
      }
    },
    response: {
      data: {
        head: {
          title: null, // should be filled with default value
          apiPath: method,
          // List of assets for yepnope,
          // Each element is an object with properties:
          //
          //    type:   css|js
          //    link:   asset_url
          //
          // example: assets.push({type: 'js', link: '//example.com/foo.js'});
          assets: []
        },
        menus: {},
        widgets: {}
      },
      headers: {},
      // Layouts are supporting "nesting" when speciefied as arrays:
      //
      //    [ 'default', 'default.blogs' ]
      //
      // In the example above, `default.blogs` will be rendered first and the
      // result will be provided for rendering to `default`.
      layout: options.layout || 'default',
      view: method
    }
  };

  //
  // env-dependent helper needs to be bounded to env
  //

  ctx.helpers.t = function (phrase, params) {
    var locale = this.runtime.locale || N.config.locales['default'];
    return N.runtime.i18n.t(locale, phrase, params);
  }.bind(ctx);

  ctx.helpers.t.exists = function (phrase) {
    var locale = this.runtime.locale || N.config.locales['default'];
    return N.runtime.i18n.hasPhrase(locale, phrase);
  }.bind(ctx);

  ctx.helpers.date = function (value, format) {
    var locale = this.runtime.locale || N.config.locales['default'];
    return date(value, format, locale, tzOffset);
  }.bind(ctx);

  ctx.helpers.render = function (apiPath, locals, layout) {
    var
    theme   = this.runtime.theme,
    locale  = this.runtime.locale,
    views   = N.runtime.views;

    if (!(views = views[locale])) {
      throw new Error("No localized views for " + locale);
    }

    if (theme && !(views = views[theme])) {
      throw new Error("Theme " + theme + " not found");
    }

    return render(views, apiPath, locals, layout);
  }.bind(ctx);

  //
  // Helper function that creates new `env` with same properties as current one
  // but diferent API method name
  //

  ctx.clone = function (name) {
    return module.exports({
      rpc:      this.origin.rpc,
      http:     this.origin.http,
      session:  deepClone(this.session),
      skip:     ['widgets', 'sessions'],
      method:   method,
      layout:   this.response.layout
    });
  }.bind(ctx);

  return ctx;
};
