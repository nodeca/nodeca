Layouts
=======

We provide nested layouts system, where each layout can have a parent layout,
just like a Russian doll. Normally you don't need more than two levels, so we
assume that top level of layout is so called "base" layout and second level is a
layout for the namespace, e.g. `blogs`. These are examples of valid layout:

- default
- default.blogs
- admin

On the filesystem each dot `.` in the layout name become slash, so the layouts
above will be stored in:

- layouts/default.jade
- layouts/default/blog.jade
- layouts/admin.jade


Rendering layouts
-----------------

We start render from the very bottom to the top. Every layout recieves `content`
local variable with previously rendered contents. Consider you have following
layouts defined:

``` jade
// file: layouts/default.jade
html
  head
    title Foo bar
  body
    != contents
```


``` jade
// file: layouts/default/blog.jade
#blog
  h1 Hello from blogs
  .posts != contents
```

Upon rendering _layout_ is set to `default.blog`, then first
`layouts/default/blog.jade` will be rendered with view's rendered `contents`.
Then the result will be passed as `contents` to `layouts/default.jade`.


Setting layout
--------------

Sometimes you need to set different base layout but do not replace default
behavior of setting namespace layout, e.g. for administrative backend, you
might do it by setting layout with `*` or `**` wildcards:

```
env.layout = 'default.forum.extra';

env.layout = 'admin.**';
env.layout; // -> 'admin.forum'

env.layout = 'foo.*.bar';
env.layout; // -> 'foo.forum.bar'
```


Optional layouts
----------------

When you want to render _sub-layout_ only when it exist you might use a special
notation, starting layout name with `~`, e.g. `default.~blog`. In this case,
when file `layouts/default/blog.jade` does not exists it will be silently
skipped and `layouts/default.jade` will be used directly.


Default layout
--------------

By default, layout is set to `default.~<namespace>`. So when `blogs.posts.show`
is called, it will be `default.~blogs`.
