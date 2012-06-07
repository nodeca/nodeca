HTTP protocol support
---------------------

We provide http support for several cases:

* application loader for clients
* html pages for search engines
* binary files


Request flow
------------

**Before magic starts:**

* Parse query params and fill `env.origin.http.req.query`
* Fill `params` and call server method (with filters)

**Server method pass:**

* Check host name and redirect if we don't  know it (to main).
* Call server method itself
* Call Renderer
  - skip if not HTTP invocation
  - care about compression (and headers)
  - if ETag exists & match - skip rendering
  - force content type and charset
  - make body and compress, if not HEAD request

**Finalization:**

* On success: use `env.response.headers`, `env.response.statusCode`,
 `env.response.body` to generade answer. Body and headers can be missed
  for some replies.
* On error: the same, as for success, but use `err.*` (passed as callback's
  argument).
  - If path NOT found - generate 404 error.


Cache support (browsers/proxy)
------------------------------

### Assets/Binary files

Those MUST have unique name for each unique content. Then we set

    Cache-Control: public, maxage=31536000
    Vary: Accept-Encoding (for compressable data)
    ETag: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    Last-Modified: yyyyyyyy

(*) Be careful with `Last-Modified` in clustered enviroment, if those relies
on file dates.

### Dynamic data

Dynamic pages mostly depends on user id & language. That sould be cared, if
someone like to make dynamic pages cacheable. You should directly specify
headers for pages, that should use cache advantages:

    Cache-Control: private, max-age=0, must-revalidate
    ETag: [contend_id]-[user_id]-[lang_id]-[theme_id]

* NO `Last-Modified` (suppress HTTP/1.0 caches)
* NEVER use `Expires` - it can fuckup user difference, if behind HTTP/1.0 cache.

NO AUTOMATION provided for dynamic pages, since that's very specific for each
application. It's only YOUR responsibility, how to optimize HEAD and 304 requests.
In good case, you will be able:

* skip data rendering
* skip most data fetch (only one, required for ETag calculation)

(*) DON'T try to improve cache everywhere. Begin with page types, that have
biggest count on your site. For example, if you have forum - start with topics,
instead of user profiles.


### 404, 410 pages

* Set infinity cache for `not found` binary files (public)
* Set 1 year cache for invalid pages, **missed from router paths**
* DON'T set 404 cache time for pages, that CAN depend on user permissions
  (all other pages). Use the same strategy, as for "working" pages.


### What can be improved

It's possible to play with `max-age` for some types of
`static` pages. We are not shure about effect, but leave it as memo:

* Articles - those are rarely changed
* Archive threads on forums - unchanged


