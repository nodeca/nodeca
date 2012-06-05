#### Excluding api methods from being processed by server middlewares/filters

When assigning a filter/middleware for a server api method, ytou might provide
`exclude` option as a list api methods which should not be affected by given
function. Such exclude patterns might be a simple string or a pattern with `*`
or `**` wildcards:

- `foo.bar.baz` matches exactly `foo.bar.baz`
- `foo.*` matches `foo.bar`, `foo.baz`, but not `foo.bar.baz` or `foo.baz.bar`
- `foo.**` matches `foo.bar`, `foo.baz`, `foo.bar.baz`, etc.


###### Examples

    // apply filter to all api methods except `foo` or any of it's childs
    nodeca.filters.before('', {exclude: ['foo', 'foo.**']}, my_filter);
