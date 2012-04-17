## Client-Server RPC

High Level (userland) looks like calling local function with callback.

    nodeca.server.<method>.<name> (param1[, param2,...], callback)

RAW level adds version number, to check if server was upgraded.

Request msg:

    version   (String)   # Mandatory. Protocol version. Example: "1.0.0"
    method    (String)   # Mandatory. API tree method to call, Example: "forums.posts.create"
    params    (Array)    # Optional. Method args

Response msg:

    version   (String)   # Mandatory. Protocol version. Example: "1.0.0"
    error     (Object)   # Optional. If exists, `error.code` and `error.message` have details
    result    (Mixed)    # Optional. Returned data, if any

For RAW level it's proposed to use socket.io (or socks.js):

    socket.emit('server', msg, callback)


#### Nodeca specific notes


Response msg:

    error     (Object)  # Optional. `err.code` always `-1`, `err.message` is the
                        # stringified error that occured. Don't mess it with
                        # `env.response.err`
    result    (Mixed)   # Equals env.response (see Server Modules specs)


## Server-Server RPC (internal)

We don't need this part right now. It can be defined later.
