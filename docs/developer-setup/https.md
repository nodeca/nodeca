How to start HTTPS
==================


1. Generate certificates
------------------------

``` bash
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr

cp server.key server.key.orig
openssl rsa -in server.key.orig -out server.key

openssl x509 -req -days 365 -in server.csr \
        -signkey server.key -out server.cert
```


2. Configure application to start HTTPS
---------------------------------------

Add `ssl` option to the `bind` config (see `application.yml.example` for
details), e.g.:

``` yaml
bind:
  default:
    listen: 0.0.0.0:443
    mount:  https://dev.nodeca.org
    ssl:
      key:  ./etc/server.key
      cert: ./etc/server.cert
```
