'use strict';


/*global underscore, N*/


// 3rd-party
var _ = underscore;


// internals
var helpers = require('./renderer/helpers');


////////////////////////////////////////////////////////////////////////////////


// Filter middleware that renders view and required layout and sets
//
// - `response.headers` with approprite headers
// - `response.body` with rendered (and compressed if allowed) html
//
N.filters.after('', { weight: 85 }, function renderer(params, callback) {
  var http, headers, layout, locals;

  if (!this.origin.http) {
    // skip non-http requests
    callback();
    return;
  }

  http    = this.origin.http,
  headers = this.response.headers,
  layout  = this.response.layout;

  //
  // Expose layout into runtime
  //

  this.runtime.layout = layout;

  //
  // Set Content-Type and charset
  //

  headers['Content-Type'] = 'text/html; charset=UTF-8';

  //
  // 304 Not Modified
  //

  if (headers['ETag'] && headers['ETag'] === http.req.headers['if-none-match']) {
    // The one who sets `ETag` header must set also (by it's own):
    //  - `Last-Modified`
    //  - `Cache-Control`
    this.response.statusCode = 304;
    callback();
    return;
  }

  //
  // HEAD requested - no need for real rendering
  //

  if ('HEAD' === http.req.method) {
    callback();
    return;
  }

  this.extras.puncher.start('Rendering');

  try {
    locals = _.extend(this.response.data, helpers, this.helpers, {runtime: this.runtime});
    this.response.body = this.render(this.response.view, locals, layout);
  } catch (err) {
    this.extras.puncher.stop();
    callback(err);
    return;
  }

  this.extras.puncher.stop();
  callback();
});
