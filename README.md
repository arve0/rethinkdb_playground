Initial setup:

```sh
brew install rethinkdb
rethinkdb &         # start db in background
npm install
```

Run example (in separate terminals):

```sh
node server.js  # socket.io emits on db changes
node index.js   # add items to test table every second
```
