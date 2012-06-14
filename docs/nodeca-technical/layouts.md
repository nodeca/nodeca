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
- layouts/default/blogs.jade
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
    != content
```


``` jade
// file: layouts/default/blog.jade
#blog
  h1 Hello from blogs
  .posts != content
```

Upon rendering _layout_ is set to `default.blog`, then first
`layouts/default/blog.jade` will be rendered with view's rendered `content`.
Then the result will be passed as `content` to `layouts/default.jade`.


Default layout
--------------

By default, layout is set to `default.<namespace>`. So when `blogs.posts.show`
is called, it will be `default.blogs`.
