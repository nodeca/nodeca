## Client-Server communication protocol

#### Request

- **version**   _(String)_ Mandatory. version nodeca protocol, Example: "1.0.0"
- **action**    _(String)_ Mandatory. API tree action to call, Example: "forums.posts.create"
- **args**      _(Array)_  Optional. Method 

#### Response

- **version**   _(String)_ Mandatory. version nodeca protocol, Example: "1.0.0"
- **error**     _(Object)_ Optional. If set contains `code` and `message`
- **data**      _(Mixed)_  Optional.
