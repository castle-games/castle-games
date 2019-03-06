# ghost-api-client

Ghost server API client

### An API client for ghost-server

This provides a simple API client for connecting to the ghost-server server. 

The main use case for it is login and identity. For that, it relies on Expo user accounts. 

### Reasons for having a separate server

There are two reasons to have a separate server instead of just using the www stack that we already have.

(1) Since Ghost is a new thing that needs to evolve in pretty fast moving ways to become something viable and good, we want to decouple it from the pretty big monolithic web stack that we have for www that has been around for a while.

(2) Since we want to connect to Ghost from Lua and JS, having a simple interface that is easy to talk to from each of those might be important.

### Implementation

The Ghost Server is implemented using a simple JSON RPC API. This base layer is in two packages here: 
https://github.com/expo/thin-api

On top of that, there are two packages here under the `js/` and `lua/` directories that are, unsurprisingly, the JS and Lua packages.

The JS version of the client can work in pretty much any JavaScript environment including Node, the Browser, Electron, React Native.

The Lua version of the client is just designed to work under Ghost.

There is still some work to do 

### The Protocol

There is one endpoint, sort of like GraphQL. By default it's http://localhost:1380/api.

For now, there is a "production" version of it that is continuously deployed from master running at https://ghost-server.app.render.com/api

To make a call, you make an HTTP POST request to that URL with an `application/json` form body that includes a JSON object with the following fields:

- `method`
- `args`

In response, you'll get back a JSON object that includes these fields:

- `data`
- `error`
- `clientError`
- `warnings`
- `result`
- `commands`

For more info about implementing API methods, read the README in [https://github.com/expo/ghost-server](ghost-server).




