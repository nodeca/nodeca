Images/Binaries & avatars
=========================

1. It's possible to store files in MongoDB GreedFS, but it's unclear how it
   affects other collections. So, we store data in file system at first release
   (and use database for meta info).
2. We use nginx to resize AND cache previews:
  [ngx_http_image_filter_module](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html) and
  [ngx_http_proxy_module](http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_store).
3. Make all pics public, where possible, to avoid permissions check.


Buckets & files location
========================

(?) Each image (or file) has 12-bytes id (bucket). (packed to 16-symbols name).

We have one path for public images, and second one for private. When file not
available on public location, we try private with permissions check. 

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
  ├─ /public/<b1b2>/<b3b4>/<bucket>.(jpg|jpeg|tiff|png|gif|zip)
  ├─ /pthumb/<b1b2>/<b3b4>/<bucket>(_<size>).jpg
  ├─ /secure/<b1b2>/<b3b4>/<bucket>.(jpg|jpeg|tiff|png|gif|zip)
  └─ /sthumb/<b1b2>/<b3b4>/<bucket>(_<size>).jpg
```

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
