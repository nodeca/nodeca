Notifications
=============


API Overview
------------

    nodeca.client.common.notify(type, message[, options]) -> Void
    nodeca.client.common.notify(message[, options]) -> Void

* `type` is a _severity_ level of a notification.
  Possible values: `info`, `error` (default).
* `message` can be a simple string or an HTML.
* `options` controls how message appears. See below


#### Options

* `closable` (Boolean) adds "close" button that allow user close notification
  when true.
* `autohide` (Number) Delay in milliseconds before automatically closing a
  notification. Disabled when `false`.

We provide default value suitable for most cases based on error type:

* **info**: `{ closable: false, autohide: 5000 }`
* **error**: `{ closable: true, autohide: 10000 }`


IO Notifications
----------------

We automatically showing notification when error happens during IO communication
(RPC calls):

* when request timeouts, we are showing default error notification
* when server/client versions mismatch, we are showing a permanent
  (non-closable) error notification in the top center position, proposing
  user to reload the page.
* when CSRF token is invalid we are showing default error notification saying
  that CSRF token was updated and that user needs to retry.
* when server returned `{ code: 500 }` we are showing default error notification
  with 'Application Error' message.

