Images/Binaries & avatars
=========================

Design goals:

* Simple (for small sites/volumes)
* Extendable (? switch backend)
* Keep public URLs after extention
* Permissions check (if needed, TBD)

General comments:

1. We use nginx to resize AND cache previews:
  [ngx_http_image_filter_module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html) and
  [ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_store).
2. Make all pics public, where possible, to avoid permissions check.


Buckets & files location (simple/small)
=======================================

(?) Each image (or file) has 12-bytes id (bucket).

In simple/small config we use plain file system to store images, and db for
meta info. 2 locations are possible: public and secure. If file is available
on public location, permissions check is skipped. 

Images have auto-generated previews.


## Size names

* xs - 100x100
* s - 130x130
* m - 200x200
* l -300x300
* xl - 500x500
* xxl - 800x800
* xxxl - 1024x1024
* w - original


## Locations

FS:

```
/<storage>/
  ├─ /secure/<b1b2>/<b3b4>/<bucket>.(jpg|jpeg|tiff|png|gif|zip)
  ├─ /sthumb/<b1b2>/<b3b4>/<bucket>(_<size>).jpg
  ├─ /public/<b1b2>/<b3b4>/@<bucket>.(jpg|jpeg|tiff|png|gif|zip) <- symlink
  └─ /pthumb/<b1b2>/<b3b4>/@<bucket>(_<size>).jpg                <- symlink
```

Public locations are symlinks. That allows easy permissions switch, without
touching master file.

Web (default):

```
/files
```


## Access algorythm

1. Search file in `public` location (original or auto-generated preview).
2. If not exists -> rewrite to `secure` location.
3. If exists -> rewrite to permission check. Else 404.
4. If permissions ok -> X-Accel-Redirect, else 403

!!! If preview not exists, we have to check too many extensions, when resizing
via nginx (bucket doesn't have original ext). Possible solution:

- keep original file without extention, return via script + X-Accel-Redirect
  with content-disposition.
- make .jpg symlink for non-jpeg images.

First method seems more universal, with acceptable speed level. It allows to
build web links without additional db request and return original file names
(do we really need it?).

Futher improvments:

- Bad requests cause double fs hit. Is it a problem?
- Permissions cache?
- Fast "not for guests" mode (check if session exists)

Avatars
=======

Avatars are usual binary images, but with different store & mount point
location. That allows to use another image sizes and different cache policy

## Size names

* xs - 30x30
* s - 50x50
* m - 70x70
* l - 100x100
* xl - 150x150
* xxl - 200x200
* w - original

## Locations

FS:

TBD. Check, if we can reuse images store.

Web (default):

```
/avatars
```

Permissions
===========

Not shure, we ever need it. Take care of this cases:

1. "Not for guests"
2. Only for users, how can read this forum/group
3. Private albums (do we really need those?)
4. What to do, if item has several restrictions?
5. How to keep interface simple?

