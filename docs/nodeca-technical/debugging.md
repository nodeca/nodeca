Debugging
=========

Skipping (js|css) compression/uglification
------------------------------------------

Set environment variable `SKIP_ASSETS_COMPRESSION=1`

    SKIP_ASSETS_COMPRESSION=1 ./nodeca.js server


Enabling debugging logs
-----------------------

Set environment variable `NODECA_DEBUG` to any (separate with `,` multiple
values) of the following values:

- **all** - enable all possible debug logs
- **trace** - enable tracing logs (those written by `nodeca.debug_trace()`)
- **filters** - enable logs of filters execution
- **assets-compressions** - enable logs of assets compressions

    NODECA_DEBUG=trace,filters ./nodeca.js server
